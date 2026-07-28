import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`login:${ip}`, 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'تم تجاوز الحد المسموح من محاولات الدخول. يرجى المحاولة بعد دقيقة.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Fetch user
    const users = await sql`SELECT id, name, email, password_hash, entity_name, phone, role, status FROM users WHERE LOWER(email) = ${cleanEmail};`;
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' },
        { status: 401 }
      );
    }

    // Check account approval status
    if (user.status === 'pending') {
      return NextResponse.json(
        { success: false, message: 'حسابك قيد مراجعة وتفعيل الإدارة. سيتم تفعيل حسابك فور اعتماد الطلب من المشرفين.' },
        { status: 403 }
      );
    }

    if (user.status === 'rejected') {
      return NextResponse.json(
        { success: false, message: 'عذراً، تم رفض طلب تفعيل هذا الحساب من قبل الإدارة.' },
        { status: 403 }
      );
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      entity_name: user.entity_name,
      phone: user.phone,
      role: user.role,
      status: user.status
    };

    // Create session token
    const token = createToken(userPayload);

    await logAudit({
      userId: user.id,
      userName: user.name,
      action: 'USER_LOGIN',
      targetType: 'USER',
      targetId: user.id,
      details: `Successful login for ${user.email}`,
      ipAddress: ip
    });

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح.',
      user: userPayload
    });

    // Set Cookie
    response.cookies.set('misk_auth_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء تسجيل الدخول.' },
      { status: 500 }
    );
  }
}

