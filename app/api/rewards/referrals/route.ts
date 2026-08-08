import { NextRequest, NextResponse } from 'next/server';
import { resolveUser, getProfile } from '@/lib/rewards';
import { supabaseAdmin } from '@/lib/supabase';
import { MILESTONE } from '@/lib/referral-counts';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
  try {
    const user = await resolveUser(code);
    if (!user) return NextResponse.json({ error: 'not found' }, { status: 404 });

    // Canonical referral list: everyone who joined via this user's link. Reading
    // `waitlist.referred_by` (not the `referrals` table) means a referred user
    // shows up here immediately, matching the web dashboard's "Recent joins".
    // The `referrals` table only supplies the Telegram verification status.
    const { data: joined } = await supabaseAdmin
      .from('waitlist')
      .select('id, full_name, created_at')
      .eq('referred_by', user.code)
      .order('created_at', { ascending: false })
      .limit(50);

    const joinedIds = (joined || []).map((j: any) => j.id);
    let verifiedIds = new Set<string>();
    if (joinedIds.length) {
      const { data: refRows } = await supabaseAdmin
        .from('referrals')
        .select('referred_id, status')
        .eq('referrer_id', user.id)
        .eq('status', 'verified')
        .in('referred_id', joinedIds);
      verifiedIds = new Set((refRows || []).map((r: any) => r.referred_id));
    }

    const list = (joined || []).map((j: any) => ({
      status: verifiedIds.has(j.id) ? 'verified' : 'pending',
      verifiedAt: null,
      createdAt: j.created_at,
      name: j.full_name || 'A friend',
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
