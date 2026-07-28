import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

// Helper to check if caller is Admin by querying DB directly
async function checkIsAdmin(): Promise<{ isAdmin: boolean; userId?: number; userName?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('misk_auth_session')?.value;
  if (!token) return { isAdmin: false };
  
  const payload = verifyToken(token);
  if (!payload || !payload.id) return { isAdmin: false };

  // Query database directly to verify current role & approved status
  const users = await sql`SELECT id, name, role, status FROM users WHERE id = ${payload.id};`;
  if (users.length === 0) return { isAdmin: false };

  const dbUser = users[0];
  const isAdmin = dbUser.role === 'admin' && dbUser.status === 'approved';
  return { isAdmin, userId: dbUser.id, userName: dbUser.name };
}

// GET /api/users - List all users & statistics
export async function GET() {
  try {
    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'غير مصرح للوصول إلا للمشرفين.' }, { status: 403 });
    }

    const users = await sql`
      SELECT id, name, email, entity_name, phone, role, status, created_at
      FROM users
      ORDER BY created_at DESC;
    `;

    return NextResponse.json({
      success: true,
      users
    });
  } catch (error: any) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH /api/users - Update user status or role
export async function PATCH(req: Request) {
  try {
    const admin = await checkIsAdmin();
    if (!admin.isAdmin) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بإجراء التعديلات.' }, { status: 403 });
    }

    const { id, status, role } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف المستخدم مطلوب.' }, { status: 400 });
    }

    const targetUser = await sql`SELECT id, name, email FROM users WHERE id = ${id};`;
    const target = targetUser[0];

    if (status) {
      await sql`UPDATE users SET status = ${status} WHERE id = ${id};`;

      if (target) {
        await logAudit({
          userId: admin.userId,
          userName: admin.userName,
          action: status === 'approved' ? 'USER_APPROVE' : 'USER_REJECT',
          targetType: 'USER',
          targetId: id,
          details: `User status changed to ${status} for ${target.email}`
        });

        await sendNotification({
          to: target.email,
          subject: status === 'approved' ? 'تم تفعيل حسابك بنجاح - MiskReserve' : 'تحديث حالة الحساب - MiskReserve',
          body: status === 'approved' 
            ? `مرحباً ${target.name}، تهانينا! تم اعتماد وتفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول وحجز القاعات.`
            : `مرحباً ${target.name}، نأسف لإبلاغك بأنه تم رفض طلب تفعيل حسابك من قبل إدارة النظام.`,
          type: status === 'approved' ? 'user_approved' : 'user_rejected',
          metadata: { userId: id }
        });
      }
    }

    if (role) {
      await sql`UPDATE users SET role = ${role} WHERE id = ${id};`;

      if (target) {
        await logAudit({
          userId: admin.userId,
          userName: admin.userName,
          action: 'USER_ROLE_CHANGE',
          targetType: 'USER',
          targetId: id,
          details: `Role updated to ${role} for ${target.email}`
        });
      }
    }

    return NextResponse.json({ success: true, message: 'تم تحديث حالة الحساب بنجاح.' });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/users?id=... - Delete user
export async function DELETE(req: Request) {
  try {
    const admin = await checkIsAdmin();
    if (!admin.isAdmin) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بحذف المستخدمين.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف المستخدم مطلوب.' }, { status: 400 });
    }

    const targetUser = await sql`SELECT id, name, email FROM users WHERE id = ${parseInt(id)};`;
    const target = targetUser[0];

    await sql`DELETE FROM users WHERE id = ${parseInt(id)};`;

    if (target) {
      await logAudit({
        userId: admin.userId,
        userName: admin.userName,
        action: 'USER_DELETE',
        targetType: 'USER',
        targetId: id,
        details: `User account deleted: ${target.email} (${target.name})`
      });
    }

    return NextResponse.json({ success: true, message: 'تم حذف الحساب بنجاح.' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
