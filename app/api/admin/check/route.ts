import { NextRequest, NextResponse } from 'next/server';
import { getSessionToken, isValidSession } from '@/lib/admin-session';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  if (isValidSession(token)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false });
}
