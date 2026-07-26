import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAuthSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const auth = await checkAuthSession();
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'غير مصرح الوصول إلا للحسابات المفعلة.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const roomId = searchParams.get('room_id');
    const status = searchParams.get('status');
    const query = searchParams.get('q');

    let bookings;

    if (date && roomId) {
      bookings = await sql`
        SELECT b.*, r.name_ar as room_name_ar, r.name_en as room_name_en, r.color as room_color
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.booking_date = ${date}::date AND b.room_id = ${parseInt(roomId)}
        ORDER BY b.start_time ASC;
      `;
    } else if (date) {
      bookings = await sql`
        SELECT b.*, r.name_ar as room_name_ar, r.name_en as room_name_en, r.color as room_color
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.booking_date = ${date}::date
        ORDER BY b.start_time ASC;
      `;
    } else {
      bookings = await sql`
        SELECT b.*, r.name_ar as room_name_ar, r.name_en as room_name_en, r.color as room_color
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        ORDER BY b.booking_date DESC, b.start_time ASC;
      `;
    }

    // Filter in JS if query or status provided for flexible matching
    let filtered = bookings;
    if (status && status !== 'all') {
      filtered = filtered.filter(b => b.status === status);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(b => 
        (b.booker_name && b.booker_name.toLowerCase().includes(q)) ||
        (b.entity_name && b.entity_name.toLowerCase().includes(q)) ||
        (b.event_title && b.event_title.toLowerCase().includes(q)) ||
        (b.room_name_ar && b.room_name_ar.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, bookings: filtered });
  } catch (error: any) {
    console.error('Fetch Bookings Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await checkAuthSession();
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'غير مصرح بالحجز إلا للحسابات المسجلة والمفعلة.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      room_id,
      booker_name,
      booker_email,
      booker_phone,
      entity_name,
      event_title,
      event_type,
      booking_date,
      start_time,
      end_time,
      attendees_count,
      requested_equipment,
      notes
    } = body;

    if (!room_id || !booker_name || !entity_name || !event_title || !booking_date || !start_time || !end_time) {
      return NextResponse.json({ success: false, error: 'Missing required booking fields.' }, { status: 400 });
    }

    // CONFLICT DETECTION ENGINE
    const conflicts = await sql`
      SELECT id, event_title, booker_name, start_time, end_time
      FROM bookings
      WHERE room_id = ${parseInt(room_id)}
        AND booking_date = ${booking_date}::date
        AND status != 'cancelled'
        AND (start_time < ${end_time}::time AND end_time > ${start_time}::time);
    `;

    if (conflicts.length > 0) {
      return NextResponse.json({
        success: false,
        conflict: true,
        conflictingBooking: conflicts[0],
        message: 'Conflict detected: The room is already booked for the selected time interval.'
      }, { status: 409 });
    }

    const result = await sql`
      INSERT INTO bookings (
        room_id, booker_name, booker_email, booker_phone, entity_name,
        event_title, event_type, booking_date, start_time, end_time,
        attendees_count, requested_equipment, notes, status
      ) VALUES (
        ${parseInt(room_id)}, ${booker_name}, ${booker_email || auth.user?.email || null}, ${booker_phone || null}, ${entity_name},
        ${event_title}, ${event_type || 'meeting'}, ${booking_date}::date, ${start_time}::time, ${end_time}::time,
        ${parseInt(attendees_count) || 1}, ${JSON.stringify(requested_equipment || [])}::jsonb, ${notes || null}, 'confirmed'
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error: any) {
    console.error('Create Booking Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await checkAuthSession();
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بإجراء هذا التعديل.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Booking ID and new status are required.' }, { status: 400 });
    }

    const result = await sql`
      UPDATE bookings
      SET status = ${status}
      WHERE id = ${parseInt(id)}
      RETURNING *;
    `;

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await checkAuthSession();
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بحذف الحجز.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Booking ID is required.' }, { status: 400 });
    }

    await sql`
      DELETE FROM bookings WHERE id = ${parseInt(id)};
    `;

    return NextResponse.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
