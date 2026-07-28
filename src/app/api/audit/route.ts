import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await checkAuthSession();
    if (!auth.authenticated || auth.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح الوصول لتقرير التدقيق إلا للمشرفين.' },
        { status: 403 }
      );
    }

    const logs = await sql`
      SELECT * FROM audit_logs
      ORDER BY id DESC
      LIMIT 200;
    `;

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('Fetch Audit Logs Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
