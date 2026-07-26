import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح.'
  });

  // Clear auth cookie
  response.cookies.set('misk_auth_session', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0)
  });

  return response;
}
