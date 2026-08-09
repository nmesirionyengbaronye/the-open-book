import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegramMessage } from '@/lib/telegram-bot';
import { isValidSession } from '@/lib/admin-session';
import { assertCsrf } from '@/lib/csrf';
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

  // Strip HTML tags for Telegram delivery. Telegram HTML parse_mode is
  // limited and the admin UI may paste full HTML documents.
  const plainText = message
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) return { ok: false, reason: 'empty_message_after_sanitize' };

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
      const r = await api.sendMessage(u.telegram_id, plainText);
      if (r.ok) sent++;
      else failed++;
    } catch {
      failed++;
    }
  }

  // Persist the sanitized message so the admin can audit what was sent.
  await logBroadcast(plainText, sent, failed);
  return { ok: true, sent, failed };
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!isValidSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    assertCsrf(req);
    const body = await req.json();
    const { action } = body;
    const adminId = req.headers.get('x-admin-id') || 'unknown';
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    async function audit(targetCode: string | null, payload: Record<string, any>) {
      try {
        await supabaseAdmin.from('admin_audit_log').insert({
          action,
          admin_identifier: adminId,
          target_referral_code: targetCode,
          payload,
          ip_address: clientIp,
          user_agent: userAgent.slice(0, 255),
        });
      } catch {
        // non-critical
      }
    }

    let result: any;
    switch (action) {
      case 'adjust':
        result = await adjustBonusReferrals(body.code, Number(body.delta) || 0);
        await audit(body.code, { delta: Number(body.delta) || 0 });
        break;
      case 'disqualify':
        result = await disqualifyUser(body.code, body.disqualified !== false);
        await audit(body.code, { disqualified: body.disqualified !== false });
        break;
      case 'pay':
        result = await markPayment(body.code, Number(body.amount) || 0, body.reference);
        await audit(body.code, { amount: Number(body.amount) || 0, reference: body.reference });
        break;
      case 'reset':
        result = await resetGiveaway();
        await audit(null, { reset: true });
        break;
      case 'stats':
        result = await getRewardStats();
        break;
      case 'activity':
        result = {
          recentSpins: await getRecentSpins(20),
          topEarners: await getTopEarners(10),
          broadcasts: await getRecentBroadcasts(10),
        };
        break;
      case 'prizeWinners':
        result = { winners: await getPrizeWinners(200) };
        break;
      case 'broadcast':
        result = await broadcastTelegram(body.message);
        await audit(null, { messageLength: body.message?.length || 0 });
        break;
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error('[rewards/admin] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
