import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await checkAuthSession();
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'غير مصرح الوصول إلا للحسابات المفعلة.' }, { status: 401 });
    }

    const rooms = await sql`
      SELECT * FROM rooms ORDER BY id ASC;
    `;
    return NextResponse.json({ success: true, rooms });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await checkAuthSession();
    if (!auth.authenticated || auth.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'غير مصرح إضافة قاعات إلا للمشرفين.' }, { status: 403 });
    }

    const body = await request.json();
    const { name_ar, name_en, code, capacity, location_ar, location_en, amenities, color } = body;

    if (!name_ar || !name_en || !code) {
      return NextResponse.json({ success: false, message: 'اسم القاعة وكود القاعة حقول إجبارية.' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO rooms (name_ar, name_en, code, capacity, location_ar, location_en, amenities, color)
      VALUES (${name_ar}, ${name_en}, ${code}, ${capacity || 10}, ${location_ar || ''}, ${location_en || ''}, ${JSON.stringify(amenities || [])}::jsonb, ${color || '#6366f1'})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, room: result[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
