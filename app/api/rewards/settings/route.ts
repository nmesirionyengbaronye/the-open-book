import { NextResponse } from 'next/server';
import { getLaunchCountdownDays } from '@/lib/rewards';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const days = await getLaunchCountdownDays();
    const { data } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'giveaway_active')
      .maybeSingle();
    return NextResponse.json({
      launchCountdownDays: days,
      giveawayActive: data?.value === 'true',
    });
  } catch (e) {
    console.error('[rewards/settings]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
