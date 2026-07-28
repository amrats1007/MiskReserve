import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await checkAuthSession();
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'غير مصرح الوصول إلا للحسابات المفعلة.' }, { status: 401 });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Single consolidated query with CTEs (Performance P4)
    const result = await sql`
      WITH total_b AS (
        SELECT COUNT(*) as count FROM bookings
      ),
      today_b AS (
        SELECT COUNT(*) as count FROM bookings WHERE booking_date = ${todayStr}::date AND status != 'cancelled'
      ),
      total_r AS (
        SELECT COUNT(*) as count FROM rooms WHERE is_active = true
      ),
      busiest_r AS (
        SELECT r.name_ar, r.name_en, COUNT(b.id) as booking_count
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        GROUP BY r.name_ar, r.name_en
        ORDER BY booking_count DESC
        LIMIT 1
      ),
      top_e AS (
        SELECT entity_name, COUNT(*) as booking_count
        FROM bookings
        GROUP BY entity_name
        ORDER BY booking_count DESC
        LIMIT 1
      )
      SELECT 
        (SELECT count FROM total_b) as total_bookings,
        (SELECT count FROM today_b) as today_bookings,
        (SELECT count FROM total_r) as total_rooms,
        (SELECT json_build_object('name_ar', name_ar, 'name_en', name_en, 'booking_count', booking_count) FROM busiest_r) as busiest_room,
        (SELECT json_build_object('entity_name', entity_name, 'booking_count', booking_count) FROM top_e) as top_entity;
    `;

    const row = result[0] || {};

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings: parseInt(row.total_bookings || '0'),
        todayBookings: parseInt(row.today_bookings || '0'),
        totalRooms: parseInt(row.total_rooms || '0'),
        busiestRoom: row.busiest_room || null,
        topEntity: row.top_entity || null
      }
    });
  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
