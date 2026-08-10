import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegramMessage, getBotToken } from '@/lib/telegram-bot';
import { getProfile, getLeaderboard } from '@/lib/rewards';

export const runtime = 'nodejs';

/**
 * Telegram bot webhook. Handles two kinds of inbound updates:
 *
 *  1. Contact shares — when a Mini App user taps "Share Phone Number", Telegram
 *     delivers the REAL, verified phone here as a message with a `contact`
 *     field. We store it keyed by Telegram user id. The rewards verify flow
 *     trusts this stored value (never a client-supplied one).
 *
 *  2. Bot commands — /start, /profile, /verify, /referrals, /share,
 *     /leaderboard, /rewards, /spin, /wallet, /rules, /help. These are the
 *     fallback path: when the Mini App is not available (e.g. the user is in a
 *     normal Telegram chat, not the web_app), the commands still respond.
 *
 * Register with: scripts/set-webhook.mjs
 * Secured via X-Telegram-Bot-Api-Secret-Token (set with setWebhook secret_token).
 */
export async function GET() {
  const token = process.env.BOT_TOKEN;
  if (!token) return Response.json({ error: 'BOT_TOKEN not set' }, { status: 500 });
  const info = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`).then((r) => r.json());
  return Response.json(info);
}

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] TELEGRAM_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  if (req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const update = await req.json();

    // --- 1. Contact share (Mini App verification) -------------------------
    const contact = update?.message?.contact;
    if (contact?.user_id && contact?.phone_number) {
      await supabaseAdmin.from('telegram_contacts').upsert(
        {
          telegram_id: String(contact.user_id),
          phone: String(contact.phone_number),
          received_at: new Date().toISOString(),
        },
        { onConflict: 'telegram_id' }
      );
    }

    // --- 2. Bot command (fallback when Mini App isn't open) ---------------
    const msg = update?.message;
    const text = msg?.text;
    const from = msg?.from;
    if (text && from?.id && text.startsWith('/')) {
      await handleCommand(String(text), String(from.id), from.username, from.first_name);
    }
  } catch {
    /* ignore malformed updates */
  }
  return NextResponse.json({ ok: true });
}

// ---------------------------------------------------------------------------
// Command handling
// ---------------------------------------------------------------------------

const APP_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://waitlist.uniui.com.ng').replace(/\/$/, '');
const MINI_APP_URL = `${APP_URL}/rewards`;

async function handleCommand(
  text: string,
  telegramId: string,
  username: string | undefined,
  firstName: string | undefined
) {
  const token = getBotToken();
  if (!token) return;

  // Strip the optional @bot suffix (/start@UniUIRewardsBot -> /start)
  const cmd = text.split(' ')[0].split('@')[0].toLowerCase();

  const reply = (body: string) =>
    sendTelegramMessage(token, telegramId, body, 'HTML').catch((e) =>
      console.error('[webhook] command reply failed', cmd, e)
    );

  switch (cmd) {
    case '/start':
      return reply(
        `🎁 <b>Welcome to UniUI Rewards</b>, ${escapeHtml(firstName || 'there')}!\n\n` +
          `This is the Uni UI student giveaway bot. Verify your Telegram number to unlock spins, mystery boxes and cash prizes.\n\n` +
          `▶️ <b>Open the Rewards Mini App:</b>\n${MINI_APP_URL}\n\n` +
          `Inside the Mini App, tap <b>“Share Phone Number”</b> to verify. Everything else (profile, referrals, wallet) lives there too.`
      );

    case '/verify':
      return reply(
        `🔐 <b>Verify your account</b>\n\n` +
          `Open the Mini App and tap <b>“Share Phone Number”</b>:\n${MINI_APP_URL}\n\n` +
          `We use Telegram’s secure contact share — no typing, no faking.`
      );

    case '/profile':
    case '/rewards':
    case '/wallet': {
      const profile = await profileByTelegram(telegramId);
      if (!profile) return notVerified(reply);
      const walletLine =
        cmd === '/wallet' || cmd === '/profile'
          ? `\n💰 Wallet: ₦${profile.walletBalance.toLocaleString()} (paid ₦${profile.walletPaid.toLocaleString()})`
          : '';
      return reply(
        `👤 <b>${escapeHtml(profile.fullName)}</b>\n` +
          `🔗 Code: <code>${profile.referralCode}</code>\n` +
          `✅ Verified referrals: ${profile.effectiveReferrals}` +
          (profile.rank ? `  ·  Rank #${profile.rank}` : '') +
          `\n🎁 Mystery boxes: ${profile.boxesOpened}/${profile.boxesDue} due\n` +
          `🎟️ Spin tickets: ${profile.spinTickets}` +
          walletLine
      );
    }

    case '/referrals': {
      const profile = await profileByTelegram(telegramId);
      if (!profile) return notVerified(reply);
      return reply(
        `👥 <b>Your referrals</b>\n\n` +
          `Verified: <b>${profile.effectiveReferrals}</b>\n` +
          `Joined via link: ${profile.joinedCount}\n` +
          `Every 7 verified referrals = 1 mystery box + 1 spin.\n\n` +
          `🔗 Your link: ${APP_URL}/r/${profile.referralCode}`
      );
    }

    case '/share': {
      const profile = await profileByTelegram(telegramId);
      if (!profile) return notVerified(reply);
      return reply(
        `🔗 <b>Share your link</b>\n\n${APP_URL}/r/${profile.referralCode}\n\n` +
          `Share it on status, groups or DMs. Each verified friend unlocks more rewards for you.`
      );
    }

    case '/leaderboard': {
      const board = await getLeaderboard(undefined, 5);
      if (!board.length) return reply('🏆 The leaderboard is empty for now. Be the first to refer!');
      const lines = board
        .map((r, i) => `${i + 1}. ${escapeHtml(r.name)} — ${r.referrals} verified`)
        .join('\n');
      return reply(`🏆 <b>Top referrers</b>\n\n${lines}`);
    }

    case '/spin':
      return reply(
        `🎰 <b>Spin the wheel inside the Mini App</b>\n\nOpen it here:\n${MINI_APP_URL}\n\n` +
          `You need spin tickets (earned from verified referrals) to play.`
      );

    case '/rules':
      return reply(
        `📜 <b>Giveaway rules</b>\n\n` +
          `• 1 spin per 7 verified referrals (unlimited).\n` +
          `• Each spin pays cash to your in-app wallet.\n` +
          `• Mystery boxes (1/2/5 tickets) unlock every 7-referral milestone.\n` +
          `• Referrals must be real, verified people.\n` +
          `• One account per person. Abuse = disqualification.\n\n` +
          `Full rules: ${MINI_APP_URL}`
      );

    case '/help':
      return reply(
        `ℹ️ <b>UniUI Rewards bot commands</b>\n\n` +
          `/start — welcome & open the Mini App\n` +
          `/verify — how to verify your number\n` +
          `/profile — your rewards summary\n` +
          `/referrals — your referral count & link\n` +
          `/share — your referral link\n` +
          `/leaderboard — top referrers\n` +
          `/rewards — boxes & spin tickets\n` +
          `/wallet — your cash balance\n` +
          `/rules — giveaway rules\n\n` +
          `▶️ Best experience: open the Mini App → ${MINI_APP_URL}`
      );

    default:
      return reply(
        `I didn't recognise that. Try /start to open the Rewards Mini App, or /help for the command list.`
      );
  }
}

function notVerified(reply: (s: string) => Promise<unknown>) {
  return reply(
    `🔐 You haven’t verified your Telegram number yet.\n\n` +
      `Open the Mini App and tap <b>“Share Phone Number”</b>:\n${MINI_APP_URL}\n\n` +
      `Your waitlist account must already exist (join at ${APP_URL} if not).`
  );
}

// --- DB lookups ----------------------------------------------------------

async function profileByTelegram(telegramId: string) {
  // Resolve the waitlist user by their Telegram id, then reuse the canonical
  // getProfile() counting logic (same numbers the Mini App shows).
  const { data: wl } = await supabaseAdmin
    .from('waitlist')
    .select('referral_code')
    .eq('telegram_id', String(telegramId))
    .maybeSingle();
  if (!wl?.referral_code) return null;
  return getProfile(wl.referral_code);
}

// --- Helpers -------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
