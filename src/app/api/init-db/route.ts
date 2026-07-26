import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    // 0. Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        entity_name VARCHAR(150) DEFAULT 'شركة مسك',
        phone VARCHAR(50),
        role VARCHAR(20) DEFAULT 'user',
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Add status column if table exists without it
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';`;
    } catch (e) {
      // Ignore if column already exists
    }

    // 1. Create rooms table
    await sql`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(100) NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        code VARCHAR(20) UNIQUE NOT NULL,
        capacity INT NOT NULL DEFAULT 10,
        location_ar VARCHAR(150),
        location_en VARCHAR(150),
        amenities JSONB DEFAULT '[]'::jsonb,
        color VARCHAR(20) DEFAULT '#6366f1',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
        booker_name VARCHAR(150) NOT NULL,
        booker_email VARCHAR(150),
        booker_phone VARCHAR(50),
        entity_name VARCHAR(150) NOT NULL,
        event_title VARCHAR(200) NOT NULL,
        event_type VARCHAR(50) DEFAULT 'meeting',
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        attendees_count INT DEFAULT 1,
        requested_equipment JSONB DEFAULT '[]'::jsonb,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'confirmed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Seed default Admin User if users table is empty
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users;`;
    if (parseInt(existingUsers[0].count) === 0) {
      const defaultAdminPass = hashPassword('admin123');
      await sql`
        INSERT INTO users (name, email, password_hash, entity_name, phone, role, status) VALUES
        ('مدير مسك رومز', 'admin@misktech.com', ${defaultAdminPass}, 'إدارة نظم المعلومات', '0500000000', 'admin', 'approved');
      `;
    }

    // 3. Seed Rooms if empty
    const existingRooms = await sql`SELECT COUNT(*) as count FROM rooms;`;
    if (parseInt(existingRooms[0].count) === 0) {
      await sql`
        INSERT INTO rooms (name_ar, name_en, code, capacity, location_ar, location_en, amenities, color) VALUES
        ('قاعة التدريب الرئيسية', 'Main Training Hall', 'TR-101', 35, 'الدور الأول - قسم الدعم الفني', '1st Floor - IT Section', '["projector", "soundSystem", "whiteboard", "laptops", "hospitality"]'::jsonb, '#6366f1'),
        ('قاعة الاجتماعات الكبرى', 'Grand Conference Room', 'CONF-A', 20, 'الدور الثاني - الإدارة العليا', '2nd Floor - Executive Suite', '["projector", "videoconf", "soundSystem", "hospitality"]'::jsonb, '#ec4899'),
        ('غرفة اجتماعات الدعم الفني', 'IT Support Room', 'IT-SUPP', 10, 'الدور الأول - غرفة الدعم', '1st Floor - Support Lab', '["whiteboard", "videoconf", "laptops"]'::jsonb, '#10b981'),
        ('قاعة الورش والابتكار', 'Innovation Lab', 'INN-02', 15, 'الدور الأرضي', 'Ground Floor', '["projector", "whiteboard", "laptops"]'::jsonb, '#f59e0b');
      `;
    }

    // 4. Seed sample bookings for today & tomorrow if empty
    const existingBookings = await sql`SELECT COUNT(*) as count FROM bookings;`;
    if (parseInt(existingBookings[0].count) === 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      await sql`
        INSERT INTO bookings (room_id, booker_name, entity_name, event_title, event_type, booking_date, start_time, end_time, attendees_count, requested_equipment, notes, status) VALUES
        (1, 'م. ممدوح السيد (الدعم الفني)', 'إدارة نظم المعلومات', 'تدريب الموظفين الجدد على نظام CashLogy', 'training', ${todayStr}, '09:00:00', '12:00:00', 18, '["projector", "laptops", "soundSystem"]'::jsonb, 'يرجى التنسيق مع السكرتارية لتجهيز 15 جهاز محمول', 'confirmed'),
        (2, 'د. خالد العمري', 'شركة الخليج للتطوير (جهة خارجية)', 'اجتماع مناقشة اتفاقية الشراكة والخدمات', 'meeting', ${todayStr}, '13:00:00', '15:00:00', 12, '["videoconf", "hospitality"]'::jsonb, 'مطلوب ضيافة للشخصيات الزائرة', 'confirmed'),
        (3, 'مهندس الدعم الفني', 'قسم الصيانة والدعم الفني', 'ورشة العمل الداخلية لحل مشاكل شبكة الفروع', 'workshop', ${tomorrowStr}, '10:00:00', '11:30:00', 8, '["whiteboard"]'::jsonb, 'اجتماع سريع لفريق الدعم', 'confirmed');
      `;
    }

    return NextResponse.json({ success: true, message: 'Database initialized & seeded successfully.' });
  } catch (error: any) {
    console.error('Init DB Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
