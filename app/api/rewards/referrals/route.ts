import { NextRequest, NextResponse } from 'next/server';
import { resolveUser, getProfile } from '@/lib/rewards';
import { supabaseAdmin } from '@/lib/supabase';

const MILESTONE = 7;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
  try {
    const user = await resolveUser(code);
    if (!user) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const { data: rows } = await supabaseAdmin
      .from('referrals')
      .select('status, verified_at, created_at, referred_id')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    const refIds = (rows || []).map((r: any) => r.referred_id);
    let names = new Map<string, string>();
    if (refIds.length) {
      const { data: users } = await supabaseAdmin
        .from('waitlist')
        .select('id, full_name')
        .in('id', refIds);
      names = new Map((users || []).map((u: any) => [u.id, u.full_name]));
    }

    const list = (rows || []).map((r: any) => ({
      status: r.status,
      verifiedAt: r.verified_at,
      createdAt: r.created_at,
      name: names.get(r.referred_id) || 'A friend',
    }));

    const profile = await getProfile(code);
    const effective = profile?.effectiveReferrals || 0;
    const mod = effective % MILESTONE;
    const need = effective > 0 && mod === 0 ? 0 : MILESTONE - mod;

    return NextResponse.json({
      referrals: list,
      progress: {
        effective,
        milestone: MILESTONE,
        completed: mod,
        boxesDue: Math.floor(effective / MILESTONE),
        boxesOpened: profile?.boxesOpened || 0,
        need,
      },
    });
  } catch (e) {
    console.error('[rewards/referrals]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
