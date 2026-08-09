import { NextRequest, NextResponse } from 'next/server';
import { openMysteryBox } from '@/lib/rewards';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const { allowed } = rateLimit(ip, 'box', 10);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Slow down.' }, { status: 429 });
    }

    const { code, boxNumber } = await req.json();
    if (!code || !boxNumber) {
      return NextResponse.json({ error: 'code and boxNumber are required' }, { status: 400 });
    }
    const res = await openMysteryBox(code, Number(boxNumber));
    if (!res.ok) return NextResponse.json(res, { status: 400 });
    return NextResponse.json(res);
  } catch (e) {
    console.error('[rewards/box]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
