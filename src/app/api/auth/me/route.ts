import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('misk_auth_session')?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, user: null });
    }

    // Refresh user state from database
    const users = await sql`SELECT id, name, email, entity_name, phone, role, status FROM users WHERE id = ${payload.id};`;
    if (users.length === 0) {
      return NextResponse.json({ success: false, user: null });
    }

    const user = users[0];

    // If user is pending or rejected, invalid session
    if (user.status !== 'approved') {
      const response = NextResponse.json({ success: false, user: null });
      response.cookies.set('misk_auth_session', '', { path: '/', expires: new Date(0) });
      return response;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entity_name: user.entity_name,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, user: null });
  }
}
