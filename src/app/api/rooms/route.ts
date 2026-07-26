import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
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
    const body = await request.json();
    const { name_ar, name_en, code, capacity, location_ar, location_en, amenities, color } = body;

    const result = await sql`
      INSERT INTO rooms (name_ar, name_en, code, capacity, location_ar, location_en, amenities, color)
      VALUES (${name_ar}, ${name_en}, ${code}, ${capacity}, ${location_ar}, ${location_en}, ${JSON.stringify(amenities)}::jsonb, ${color})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, room: result[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
