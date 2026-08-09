import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSession, destroySession } from '@/lib/admin-session';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const validUser = process.env.ADMIN_USERNAME;
    const validPass = process.env.ADMIN_PASSWORD;

    if (!validUser || !validPass) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
    }

    if (username === validUser && password === validPass) {
      const session = createSession();
      const cookieStore = await cookies();
      cookieStore.set(session.cookie.name, session.cookie.value, session.cookie.options);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (e) {
    console.error('[admin/login] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (token) {
      destroySession(token);
    }
    const cookieStore = await cookies();
    cookieStore.set('admin_session', '', { path: '/', maxAge: 0 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[admin/logout] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
