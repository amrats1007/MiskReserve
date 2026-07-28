import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, entity_name, phone } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول الأساسية (الاسم، البريد، كلمة المرور) مطلوبة.' },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim().substring(0, 150);
    const cleanEmail = String(email).trim().toLowerCase().substring(0, 150);
    const userEntity = entity_name ? String(entity_name).trim().substring(0, 150) : 'شركة مسك';
    const userPhone = phone ? String(phone).trim().substring(0, 50) : '';

    // Check if email exists
    const existing = await sql`SELECT id FROM users WHERE LOWER(email) = ${cleanEmail};`;
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني مسجل بالفعل بالنظام.' },
        { status: 400 }
      );
    }

    // Hash password with 600,000 iterations
    const hashedPassword = hashPassword(password);

    // Insert user (defaults status to 'pending')
    const result = await sql`
      INSERT INTO users (name, email, password_hash, entity_name, phone, role, status)
      VALUES (${cleanName}, ${cleanEmail}, ${hashedPassword}, ${userEntity}, ${userPhone}, 'user', 'pending')
      RETURNING id, name, email, entity_name, phone, role, status;
    `;

    const user = result[0];

    // Do NOT set session cookie for pending users — user must wait for admin approval
    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب إنشاء الحساب بنجاح! حسابك قيد مراجعة واعتماد الإدارة قبل تسجيل الدخول.',
      user
    });

  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء إنشاء الحساب.' },
      { status: 500 }
    );
  }
}
