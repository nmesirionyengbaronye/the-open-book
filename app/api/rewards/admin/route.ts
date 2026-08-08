import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegramMessage } from '@/lib/telegram-bot';
import {
  adjustBonusReferrals,
  disqualifyUser,
  markPayment,
  resetGiveaway,
  getTotalLaunchTokens,
  getRecentSpins,
  getTopEarners,
  getRecentBroadcasts,
  getPrizeWinners,
  logBroadcast,
} from '@/lib/rewards';

async function getRewardStats() {
  const [
    w,
    v,
    p,
    boxes,
    spins,
    paid,
    tgUsers,
    bcCount,
    bcLast,
  ] = await Promise.all([
    supabaseAdmin.from('waitlist').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('referrals').select('*', { count: 'exact', head: true }).eq('status', 'verified'),
    supabaseAdmin.from('referrals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('mystery_boxes').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('spin_history').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('payments').select('amount').eq('status', 'paid'),
    supabaseAdmin.from('telegram_users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('broadcasts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('broadcasts').select('created_at').order('created_at', { ascending: false }).limit(1),
  ]);

  const totalPaid = (paid.data || []).reduce((s: number, r: any) => s + (r.amount || 0), 0);
  const tokensAtLaunch = await getTotalLaunchTokens();

  return {
    totalWaitlist: w.count || 0,
    verifiedUsers: tgUsers.count || 0,
    verifiedReferrals: v.count || 0,
    pendingReferrals: p.count || 0,
    boxesOpened: boxes.count || 0,
    spinsCompleted: spins.count || 0,
    moneyPaid: totalPaid,
    tokensAtLaunch,
    broadcastsSent: bcCount.count || 0,
    lastBroadcastAt: (bcLast.data as { created_at: string }[] | null)?.[0]?.created_at || null,
  };
}

async function broadcastTelegram(message: string) {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) return { ok: false, reason: 'no_bot_token' };
  if (!message || !message.trim()) return { ok: false, reason: 'empty_message' };

  const { data: users } = await supabaseAdmin
    .from('telegram_users')
    .select('telegram_id')
    .eq('verified', true);
  if (!users || users.length === 0) return { ok: true, sent: 0, failed: 0 };

  const api = { sendMessage: (chatId: string, text: string) => sendTelegramMessage(botToken, chatId, text) };
  let sent = 0;
  let failed = 0;
  for (const u of users as { telegram_id: string }[]) {
    try {
      const r = await api.sendMessage(u.telegram_id, message);
      if (r.ok) sent++;
      else failed++;
    } catch {
      failed++;
    }
  }

  // Persist so the admin can audit what was sent.
  await logBroadcast(message, sent, failed);
  return { ok: true, sent, failed };
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { action } = body;
    switch (action) {
      case 'adjust':
        return NextResponse.json(
          await adjustBonusReferrals(body.code, Number(body.delta) || 0)
        );
      case 'disqualify':
        return NextResponse.json(
          await disqualifyUser(body.code, body.disqualified !== false)
        );
      case 'pay':
        return NextResponse.json(
          await markPayment(body.code, Number(body.amount) || 0, body.reference)
        );
      case 'reset':
        return NextResponse.json(await resetGiveaway());
      case 'stats':
        return NextResponse.json(await getRewardStats());
      case 'activity':
        return NextResponse.json({
          recentSpins: await getRecentSpins(20),
          topEarners: await getTopEarners(10),
          broadcasts: await getRecentBroadcasts(10),
        });
      case 'prizeWinners':
        return NextResponse.json({ winners: await getPrizeWinners(200) });
      case 'broadcast':
        return NextResponse.json(await broadcastTelegram(body.message));
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }
  } catch (e) {
    console.error('[rewards/admin]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
