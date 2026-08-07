import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  adjustBonusReferrals,
  disqualifyUser,
  markPayment,
  resetGiveaway,
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
  ] = await Promise.all([
    supabaseAdmin.from('waitlist').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('referrals').select('*', { count: 'exact', head: true }).eq('status', 'verified'),
    supabaseAdmin.from('referrals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('mystery_boxes').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('spin_history').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('payments').select('amount').eq('status', 'paid'),
    supabaseAdmin.from('telegram_users').select('*', { count: 'exact', head: true }),
  ]);

  const totalPaid = (paid.data || []).reduce((s: number, r: any) => s + (r.amount || 0), 0);

  return {
    totalWaitlist: w.count || 0,
    verifiedUsers: tgUsers.count || 0,
    verifiedReferrals: v.count || 0,
    pendingReferrals: p.count || 0,
    boxesOpened: boxes.count || 0,
    spinsCompleted: spins.count || 0,
    moneyPaid: totalPaid,
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
  let sent = 0;
  let failed = 0;
  for (const u of users as { telegram_id: string }[]) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: u.telegram_id, text: message, parse_mode: 'HTML' }),
      });
      if (r.ok) sent++;
      else failed++;
    } catch {
      failed++;
    }
  }
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
