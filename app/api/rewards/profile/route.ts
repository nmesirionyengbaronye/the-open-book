import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/rewards';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
  try {
    const profile = await getProfile(code);
    if (!profile) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(profile);
  } catch (e) {
    console.error('[rewards/profile]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
