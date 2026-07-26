import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword, createToken } from '@/lib/auth';

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

    const cleanEmail = email.trim().toLowerCase();

    // Check if email exists
    const existing = await sql`SELECT id FROM users WHERE LOWER(email) = ${cleanEmail};`;
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني مسجل بالفعل بالنظام.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(password);
    const userEntity = entity_name || 'شركة مسك';
    const userPhone = phone || '';

    // Insert user
    const result = await sql`
      INSERT INTO users (name, email, password_hash, entity_name, phone, role)
      VALUES (${name}, ${cleanEmail}, ${hashedPassword}, ${userEntity}, ${userPhone}, 'user')
      RETURNING id, name, email, entity_name, phone, role;
    `;

    const user = result[0];

    // Create session token
    const token = createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      entity_name: user.entity_name,
      role: user.role
    });

    const response = NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح.',
      user
    });

    // Set HTTP-Only Cookie
    response.cookies.set('misk_auth_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;

  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء إنشاء الحساب.' },
      { status: 500 }
    );
  }
}
