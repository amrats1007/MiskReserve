import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const totalCountRes = await sql`SELECT COUNT(*) as count FROM bookings;`;
    const todayCountRes = await sql`SELECT COUNT(*) as count FROM bookings WHERE booking_date = ${todayStr}::date AND status != 'cancelled';`;
    const totalRoomsRes = await sql`SELECT COUNT(*) as count FROM rooms WHERE is_active = true;`;
    
    // Busiest Room
    const busiestRoomRes = await sql`
      SELECT r.name_ar, r.name_en, COUNT(b.id) as booking_count
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      GROUP BY r.name_ar, r.name_en
      ORDER BY booking_count DESC
      LIMIT 1;
    `;

    // Top Entity
    const topEntityRes = await sql`
      SELECT entity_name, COUNT(*) as booking_count
      FROM bookings
      GROUP BY entity_name
      ORDER BY booking_count DESC
      LIMIT 1;
    `;

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings: parseInt(totalCountRes[0]?.count || '0'),
        todayBookings: parseInt(todayCountRes[0]?.count || '0'),
        totalRooms: parseInt(totalRoomsRes[0]?.count || '0'),
        busiestRoom: busiestRoomRes[0] || null,
        topEntity: topEntityRes[0] || null
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
