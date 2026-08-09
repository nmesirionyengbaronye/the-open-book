import { NextRequest, NextResponse } from 'next/server';
import { spinWheel } from '@/lib/rewards';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const { allowed } = rateLimit(ip, 'spin', 10);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many spins. Slow down.' }, { status: 429 });
    }

    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
    const res = await spinWheel(code);
    if (!res.ok) return NextResponse.json(res, { status: 400 });
    return NextResponse.json(res);
  } catch (e) {
    console.error('[rewards/spin]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
