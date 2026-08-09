import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionToken, destroySession } from '@/lib/admin-session';

export async function POST() {
  try {
    const token = (await cookies()).get('admin_session')?.value;
    if (token) {
      destroySession(token);
    }
    const cookieStore = await cookies();
    cookieStore.set('admin_session', '', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production',
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[admin/logout] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
