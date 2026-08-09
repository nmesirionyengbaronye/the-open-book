import { supabaseAdmin } from '@/lib/supabase';
import { normalizeWhatsApp, isLikelyPhone } from '@/lib/validation';
import { PRIZE_VALUES } from '@/lib/prizes';
import { sendTelegramMessage } from '@/lib/telegram-bot';
import {
  MILESTONE,
  filterDisqualified,
  getRankFromBoard,
  getRankedReferrers,
  getReferralCount,
  getVerifiedReferralCount as getVerifiedCount,
} from '@/lib/referral-counts';

export { MILESTONE };

// Reward range: ₦200 – ₦10,000 (server-controlled, never client).
// Weights sum to 1,000,000 so each unit = 0.0001% (lets ₦10,000 be a true
// 1-in-a-million without losing precision).
//   ₦200     → 95.0000%   everyone mostly lands here
//   ₦500     →  4.8969%   rare (the only other "normal" prize)
//   ₦1000    →  0.1000%   almost impossible
//   ₦2000    →  0.0020%   legendary
//   ₦5000    →  0.0010%   legendary
//   ₦10000   →  0.0001%   impossible — but possible (≈ 1 in 1,000,000 spins)
// The first TWO spinners still get a guaranteed ₦1000 on their first try
// (enforced by the claim_first_spin_grant RPC), independent of this table.
export const PRIZES = [...PRIZE_VALUES];
const PRIZE_WEIGHTS = [950000, 48969, 1000, 20, 10, 1];

const BOX_TICKETS = [1, 2, 5];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function weightedPrize(): number {
  const total = PRIZE_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PRIZES.length; i++) {
    if (r < PRIZE_WEIGHTS[i]) return PRIZES[i];
    r -= PRIZE_WEIGHTS[i];
  }
  return PRIZES[0];
}

function shuffleTickets(): [number, number, number] {
  const arr = [...BOX_TICKETS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr as [number, number, number];
}

// ---------------------------------------------------------------------------
// User resolution
// ---------------------------------------------------------------------------
export type ResolvedUser = { id: string; code: string } | null;

export async function resolveUser(codeOrPhone: string): Promise<ResolvedUser> {
  const raw = codeOrPhone.trim();
  let query = supabaseAdmin.from('waitlist').select('id, referral_code');

  if (isLikelyPhone(raw)) {
    const normalized = normalizeWhatsApp(raw);
    if (!normalized) return null;
    query = query.eq('whatsapp_number', normalized);
  } else {
    query = query.eq('referral_code', raw.toUpperCase());
  }

  const { data } = await query.maybeSingle();
  if (!data) return null;
  return { id: data.id as string, code: data.referral_code as string };
}

// ---------------------------------------------------------------------------
// Counts / rank / leaderboard
//
// All of these now delegate to lib/referral-counts.ts so the Telegram Mini App,
// the web dashboard, both leaderboards and the badge engine report the same
// number for the same user.
// ---------------------------------------------------------------------------

/** Telegram-verified referrals only. Diagnostic — not the number users see. */
export async function getVerifiedReferralCount(userId: string): Promise<number> {
  return getVerifiedCount(userId);
}

/** Canonical referral count (joined via link + admin bonus). */
export async function getEffectiveReferralCount(
  userId: string,
  referralCode?: string
): Promise<number> {
  let code = referralCode;
  if (!code) {
    const { data } = await supabaseAdmin
      .from('waitlist')
      .select('referral_code')
      .eq('id', userId)
      .maybeSingle();
    if (!data?.referral_code) return 0;
    code = data.referral_code as string;
  }
  return getReferralCount({ id: userId, referralCode: code }, 'canonical');
}

export async function getRank(userId: string): Promise<number | null> {
  return getRankFromBoard(userId);
}

export type LeaderboardEntry = {
  rank: number;
  name: string;
  code: string;
  referrals: number;
  isCurrentUser: boolean;
};

/** Canonical leaderboard. `limit` defaults to 20; the homepage passes 10. */
export async function getLeaderboard(
  currentUserId?: string,
  limit = 20
): Promise<LeaderboardEntry[]> {
  const board = await getRankedReferrers();
  return board.slice(0, limit).map((r, i) => ({
    rank: i + 1,
    name: r.fullName,
    code: r.referralCode,
    referrals: r.count,
    isCurrentUser: r.userId === currentUserId,
  }));
}

export async function getLaunchCountdownDays(): Promise<number> {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'launch_date')
    .maybeSingle();
  if (!data?.value) return -1;
  const target = new Date(`${data.value}T00:00:00Z`).getTime();
  const days = Math.ceil((target - Date.now()) / 86_400_000);
  return Math.max(0, days);
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export type RewardsProfile = {
  referralCode: string;
  fullName: string;
  /** Telegram-verified subset — exposed for transparency, not the headline stat. */
  verifiedReferrals: number;
  /** Canonical count (joined + bonus). This is the number shown to users. */
  effectiveReferrals: number;
  /** Raw joins via this user's link, for display only. */
  joinedCount: number;
  rank: number | null;
  boxesDue: number;
  boxesOpened: number;
  spinTickets: number;
  walletBalance: number;
  walletPaid: number;
  walletPending: number;
  launchTokens: number; // 500 tokens per completed 7-referral milestone, granted at AI launch
  launchCountdownDays: number;
  disqualified: boolean;
  telegramVerified: boolean;
};

export async function getProfile(codeOrPhone: string): Promise<RewardsProfile | null> {
  const user = await resolveUser(codeOrPhone);
  if (!user) return null;

  const { data: wl } = await supabaseAdmin
    .from('waitlist')
    .select(
      'referral_code, full_name, mystery_boxes, spin_tickets, wallet_balance, wallet_paid, disqualified, telegram_verified, bonus_referrals'
    )
    .eq('id', user.id)
    .maybeSingle();
  if (!wl) return null;

  const verified = await getVerifiedReferralCount(user.id);
  const effective = await getEffectiveReferralCount(user.id, wl.referral_code);
  const rank = await getRank(user.id);
  const boxesOpened = wl.mystery_boxes || 0;
  const boxesDue = Math.floor(effective / MILESTONE);
  const walletBalance = wl.wallet_balance || 0;
  const walletPaid = wl.wallet_paid || 0;

  const { count: joinedCount } = await supabaseAdmin
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', wl.referral_code);

  console.log('[rewards/profile]', {
    userId: user.id,
    code: wl.referral_code,
    telegram_verified: wl.telegram_verified,
    bonus_referrals: wl.bonus_referrals,
    verified,
    effective,
    joinedCount: joinedCount || 0,
    rank,
    boxesDue,
  });

  return {
    referralCode: wl.referral_code,
    fullName: wl.full_name,
    verifiedReferrals: verified,
    effectiveReferrals: effective,
    joinedCount: joinedCount || 0,
    rank,
    boxesDue,
    boxesOpened,
    spinTickets: wl.spin_tickets || 0,
    walletBalance,
    walletPaid,
    walletPending: Math.max(0, walletBalance - walletPaid),
    launchTokens: 500 * Math.floor(effective / MILESTONE),
    launchCountdownDays: await getLaunchCountdownDays(),
    disqualified: wl.disqualified || false,
    telegramVerified: wl.telegram_verified || false,
  };
}

// ---------------------------------------------------------------------------
// Telegram verification (web equivalent of bot /start contact)
// ---------------------------------------------------------------------------
export async function verifyTelegram(
  phone: string,
  telegramId: string,
  username?: string
) {
  const normalized = normalizeWhatsApp(phone);
  if (!normalized)
    return {
      ok: false as const,
      reason: 'invalid_phone',
      error: 'That phone number doesn’t look valid. Use your Nigerian number (e.g. 080… or +234…).',
    };

  // A Telegram account must not be linked to a different phone.
  const { data: existingTg } = await supabaseAdmin
    .from('telegram_users')
    .select('waitlist_id')
    .eq('telegram_id', String(telegramId))
    .maybeSingle();
  if (existingTg) {
    const { data: samePhone } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('id', existingTg.waitlist_id)
      .eq('whatsapp_number', normalized)
      .maybeSingle();
    if (!samePhone)
      return {
        ok: false as const,
        reason: 'telegram_taken',
        error: 'This Telegram account is already linked to a different waitlist number.',
      };
  }

  const { data: user, error } = await supabaseAdmin
    .from('waitlist')
    .select('id, referral_code')
    .eq('whatsapp_number', normalized)
    .maybeSingle();
  if (error || !user) return { ok: false as const, reason: 'not_on_waitlist' };

  console.log('[rewards/verify] matched user', {
    userId: user.id,
    referralCode: user.referral_code,
    phone: normalized,
    telegramId,
  });

  await supabaseAdmin
    .from('waitlist')
    .update({
      telegram_verified: true,
      telegram_id: String(telegramId),
      telegram_username: username || null,
    })
    .eq('id', user.id);

  await supabaseAdmin
    .from('telegram_users')
    .upsert(
      {
        telegram_id: String(telegramId),
        waitlist_id: user.id,
        telegram_username: username || null,
        verified: true,
      },
      { onConflict: 'telegram_id' }
    );

  // Promote pending referrals where THIS user is the referred person.
  const { data: pending } = await supabaseAdmin
    .from('referrals')
    .select('referrer_id')
    .eq('referred_id', user.id)
    .eq('status', 'pending');

  console.log('[rewards/verify] pending referrals to promote', {
    userId: user.id,
    count: pending?.length || 0,
    referrerIds: (pending || []).map((p: any) => p.referrer_id),
  });

  if (pending && pending.length) {
    const { error: updateError } = await supabaseAdmin
      .from('referrals')
      .update({ status: 'verified', verified_at: new Date().toISOString() })
      .eq('referred_id', user.id)
      .eq('status', 'pending');

    console.log('[rewards/verify] promotion result', {
      userId: user.id,
      updated: !updateError,
      error: updateError?.message,
    });

    for (const p of pending as { referrer_id: string }[]) {
      await awardMysteryBoxes(p.referrer_id);
      await notifyReferrerOfVerification(p.referrer_id, user.id);
    }
  }

  // Safety net: if this user joined via someone's link but the join-time
  // referral row was missed (that insert is best-effort), ensure a verified
  // referrals row exists so the referrer's dashboard and rank credit them.
  const { data: meRow } = await supabaseAdmin
    .from('waitlist')
    .select('referred_by')
    .eq('id', user.id)
    .maybeSingle();
  if (meRow?.referred_by) {
    const { data: refRow } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('referral_code', meRow.referred_by)
      .maybeSingle();
    if (refRow) {
      const { error: upsertErr } = await supabaseAdmin
        .from('referrals')
        .upsert(
          {
            referrer_id: refRow.id,
            referred_id: user.id,
            status: 'verified',
            verified_at: new Date().toISOString(),
          },
          { onConflict: 'referrer_id,referred_id' }
        );
      if (!upsertErr) await awardMysteryBoxes(refRow.id);
    }
  }

  return { ok: true as const, profile: await getProfile(user.referral_code) };
}

// ---------------------------------------------------------------------------
// Mystery boxes
// ---------------------------------------------------------------------------
/** Compute how many boxes are due vs opened (eligibility). */
export async function awardMysteryBoxes(userId: string) {
  const effective = await getEffectiveReferralCount(userId);
  const boxesDue = Math.floor(effective / MILESTONE);
  const { count: opened } = await supabaseAdmin
    .from('mystery_boxes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  return {
    boxesDue,
    boxesOpened: opened || 0,
    eligible: Math.max(0, boxesDue - (opened || 0)),
  };
}

export async function openMysteryBox(
  codeOrPhone: string,
  boxNumber: number
) {
  if (![1, 2, 3].includes(boxNumber)) {
    return { ok: false as const, reason: 'invalid_box' };
  }
  const user = await resolveUser(codeOrPhone);
  if (!user) return { ok: false as const, reason: 'not_found' };

  const { data: wl } = await supabaseAdmin
    .from('waitlist')
    .select('mystery_boxes, spin_tickets, disqualified')
    .eq('id', user.id)
    .maybeSingle();
  if (!wl) return { ok: false as const, reason: 'not_found' };
  if (wl.disqualified) return { ok: false as const, reason: 'disqualified' };

  const effective = await getEffectiveReferralCount(user.id);
  const boxesDue = Math.floor(effective / MILESTONE);
  const boxesOpened = wl.mystery_boxes || 0;
  if (boxesOpened >= boxesDue) return { ok: false as const, reason: 'no_box_available' };

  const perm = shuffleTickets();
  const tickets = perm[boxNumber - 1];

  await supabaseAdmin
    .from('mystery_boxes')
    .insert({ user_id: user.id, box_number: boxNumber, tickets_awarded: tickets });

  const { data: updated } = await supabaseAdmin
    .from('waitlist')
    .update({
      mystery_boxes: boxesOpened + 1,
      spin_tickets: (wl.spin_tickets || 0) + tickets,
    })
    .eq('id', user.id)
    .select('spin_tickets, mystery_boxes')
    .maybeSingle();

  return {
    ok: true as const,
    tickets,
    permutation: perm,
    boxesOpened: updated?.mystery_boxes ?? boxesOpened + 1,
    boxesDue,
    spinTickets: updated?.spin_tickets ?? (wl.spin_tickets || 0) + tickets,
  };
}

// ---------------------------------------------------------------------------
// Spin wheel
// ---------------------------------------------------------------------------
export async function spinWheel(codeOrPhone: string) {
  const user = await resolveUser(codeOrPhone);
  if (!user) return { ok: false as const, reason: 'not_found' };

  const { data: wl } = await supabaseAdmin
    .from('waitlist')
    .select('spin_tickets, wallet_balance, disqualified')
    .eq('id', user.id)
    .maybeSingle();
  if (!wl) return { ok: false as const, reason: 'not_found' };
  if (wl.disqualified) return { ok: false as const, reason: 'disqualified' };
  if ((wl.spin_tickets || 0) < 1) return { ok: false as const, reason: 'no_tickets' };

  // Is this the user's very first spin?
  const { count: priorSpins } = await supabaseAdmin
    .from('spin_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);
  const isFirstSpin = (priorSpins || 0) === 0;

  // The first TWO people (distinct users) on their first try win a guaranteed
  // ₦1000; everyone else — and every later spin — follows the weighted table.
  // claim_first_spin_grant is atomic (Postgres fn) so the cap of 2 is enforced
  // even under concurrent spins. If the RPC/table isn't deployed yet it simply
  // returns false and the normal distribution is used.
  let prize: number;
  if (isFirstSpin) {
    const { data: granted } = await supabaseAdmin.rpc('claim_first_spin_grant', {
      p_user_id: user.id,
    });
    prize = granted ? 1000 : weightedPrize();
  } else {
    prize = weightedPrize();
  }

  await supabaseAdmin
    .from('waitlist')
    .update({
      spin_tickets: wl.spin_tickets - 1,
      wallet_balance: (wl.wallet_balance || 0) + prize,
    })
    .eq('id', user.id);

  await supabaseAdmin
    .from('spin_history')
    .insert({ user_id: user.id, prize, paid: false });

  // Alert the backend/admin on every win. Big wins (>= ₦1000) are flagged so
  // they stand out in logs; the admin Recent Spins panel already surfaces all
  // wins via getRecentSpins() (which reads from spin_history).
  console.log('[rewards/spin] WIN', {
    user: user.id,
    prize,
    walletBalance: (wl.wallet_balance || 0) + prize,
    isFirstSpin,
  });
  if (prize >= 1000) {
    console.warn('[rewards/spin] BIG WIN — admin attention', { user: user.id, prize });
  }

  return {
    ok: true as const,
    prize,
    firstSpinBonus: isFirstSpin && prize === 1000,
    ticketsLeft: wl.spin_tickets - 1,
    walletBalance: (wl.wallet_balance || 0) + prize,
  };
}

// ---------------------------------------------------------------------------
// Wallet
// ---------------------------------------------------------------------------
export type WalletInfo = {
  balance: number;
  paid: number;
  pending: number;
  history: { prize: number; paid: boolean; created_at: string }[];
};

export async function getWallet(codeOrPhone: string): Promise<WalletInfo | null> {
  const user = await resolveUser(codeOrPhone);
  if (!user) return null;

  const { data: wl } = await supabaseAdmin
    .from('waitlist')
    .select('wallet_balance, wallet_paid')
    .eq('id', user.id)
    .maybeSingle();

  const { data: history } = await supabaseAdmin
    .from('spin_history')
    .select('prize, paid, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const balance = wl?.wallet_balance || 0;
  const paid = wl?.wallet_paid || 0;
  return {
    balance,
    paid,
    pending: Math.max(0, balance - paid),
    history: (history as WalletInfo['history']) || [],
  };
}

/**
 * Record a payout against a user's wallet.
 *
 * Idempotency: the Prizes admin page calls this once per click with
 * `amount = pending`, so a double click used to insert two payment rows and
 * push `wallet_paid` above `wallet_balance` (i.e. over-paying the user).
 * Guards, in order:
 *   1. reject when nothing is outstanding,
 *   2. reject a replayed `reference` for the same user,
 *   3. clamp the amount to what is actually still owed,
 *   4. clamp the recomputed total to `wallet_balance`.
 */
export async function markPayment(
  codeOrPhone: string,
  amount: number,
  reference: string
) {
  const user = await resolveUser(codeOrPhone);
  if (!user) return { ok: false as const, reason: 'not_found' };

  const { data: wl } = await supabaseAdmin
    .from('waitlist')
    .select('wallet_balance, wallet_paid')
    .eq('id', user.id)
    .maybeSingle();
  if (!wl) return { ok: false as const, reason: 'not_found' };

  const balance = wl.wallet_balance || 0;
  const alreadyPaid = wl.wallet_paid || 0;
  const outstanding = Math.max(0, balance - alreadyPaid);

  // (1) Nothing left to pay — treat repeat clicks as a no-op, not an over-pay.
  if (outstanding <= 0) {
    return {
      ok: true as const,
      alreadySettled: true,
      paymentId: null,
      totalPaid: Math.min(alreadyPaid, balance),
    };
  }

  // (2) Same reference already recorded for this user → replay, ignore.
  if (reference) {
    const { data: dupe } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('reference', reference)
      .maybeSingle();
    if (dupe) {
      return {
        ok: true as const,
        duplicate: true,
        paymentId: dupe.id,
        totalPaid: alreadyPaid,
      };
    }
  }

  // (3) Never record more than is owed.
  const applied = Math.min(Math.max(0, amount), outstanding);
  if (applied <= 0) return { ok: false as const, reason: 'invalid_amount' };

  const { data: inserted } = await supabaseAdmin
    .from('payments')
    .insert({
      user_id: user.id,
      amount: applied,
      status: 'paid',
      reference: reference || null,
      paid_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle();

  if (!inserted) return { ok: false as const, reason: 'insert_failed' };

  // (4) Recompute from the ledger, capped at the balance so a stray historical
  // row can never leave wallet_paid > wallet_balance.
  const { data: paidRows } = await supabaseAdmin
    .from('payments')
    .select('amount')
    .eq('user_id', user.id)
    .eq('status', 'paid');

  const ledgerTotal = (paidRows || []).reduce((s: number, r: any) => s + (r.amount || 0), 0);
  const totalPaid = Math.min(ledgerTotal, balance);

  await supabaseAdmin
    .from('waitlist')
    .update({ wallet_paid: totalPaid })
    .eq('id', user.id);

  return { ok: true as const, paymentId: inserted.id, totalPaid, applied };
}

// ---------------------------------------------------------------------------
// Rewards activity (admin tracking)
// ---------------------------------------------------------------------------
export type RecentSpin = {
  name: string;
  code: string;
  prize: number;
  paid: boolean;
  created_at: string;
};

export async function getRecentSpins(limit = 20): Promise<RecentSpin[]> {
  const { data } = await supabaseAdmin
    .from('spin_history')
    .select('prize, paid, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(limit * 2); // over-fetch: disqualified rows are dropped below
  if (!data || data.length === 0) return [];
  const ids = (data as { user_id: string }[]).map((r) => r.user_id);
  const { data: users } = await supabaseAdmin
    .from('waitlist')
    .select('id, full_name, referral_code, disqualified')
    .in('id', ids);
  // Same disqualification rule as the public winners feed.
  const userMap = new Map(filterDisqualified(users || []).map((u: any) => [u.id, u]));
  return (data as any[])
    .filter((r) => userMap.has(r.user_id))
    .slice(0, limit)
    .map((r) => {
      const u = userMap.get(r.user_id);
      return {
        name: u?.full_name || 'Anonymous',
        code: u?.referral_code || '',
        prize: r.prize,
        paid: r.paid,
        created_at: r.created_at,
      };
    });
}

export type TopEarner = { name: string; code: string; balance: number };

export async function getTopEarners(limit = 10): Promise<TopEarner[]> {
  const { data } = await supabaseAdmin
    .from('waitlist')
    .select('full_name, referral_code, wallet_balance, disqualified')
    .eq('disqualified', false)
    .order('wallet_balance', { ascending: false })
    .limit(limit);
  return filterDisqualified(data || []).map((r: any) => ({
    name: r.full_name || 'Anonymous',
    code: r.referral_code || '',
    balance: r.wallet_balance || 0,
  }));
}

export type PrizeWinner = {
  name: string;
  code: string;
  winnings: number;
  paid: number;
  pending: number;
  fullyPaid: boolean;
};

/** Everyone who has won a prize (wallet_balance > 0) with payment status. */
export async function getPrizeWinners(limit = 200): Promise<PrizeWinner[]> {
  const { data } = await supabaseAdmin
    .from('waitlist')
    .select('referral_code, full_name, wallet_balance, wallet_paid')
    .gt('wallet_balance', 0)
    .order('wallet_balance', { ascending: false })
    .limit(limit);
  return (data || []).map((u: any) => {
    const winnings = u.wallet_balance || 0;
    const paid = u.wallet_paid || 0;
    return {
      name: u.full_name || 'Anonymous',
      code: u.referral_code || '',
      winnings,
      paid,
      pending: Math.max(0, winnings - paid),
      fullyPaid: paid >= winnings,
    };
  });
}

export type BroadcastRecord = {
  id: number;
  message: string;
  sent: number;
  failed: number;
  created_at: string;
};

export async function logBroadcast(message: string, sent: number, failed: number) {
  await supabaseAdmin.from('broadcasts').insert({ message, sent, failed });
}

export async function getRecentBroadcasts(limit = 10): Promise<BroadcastRecord[]> {
  const { data } = await supabaseAdmin
    .from('broadcasts')
    .select('id, message, sent, failed, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as BroadcastRecord[]) || [];
}

/** Total launch tokens owed = 500 per completed 7-referral milestone, across all users. */
export async function getTotalLaunchTokens(): Promise<number> {
  // Uses the canonical board so this agrees with each user's own launchTokens.
  const board = await getRankedReferrers();
  return board.reduce((sum, r) => sum + 500 * Math.floor(r.count / MILESTONE), 0);
}

// ---------------------------------------------------------------------------
// Telegram notifications
// ---------------------------------------------------------------------------

/**
 * Notify a referrer that one of their referrals just verified on Telegram.
 * Best-effort: failures are logged but never break the verify flow.
 */
export async function notifyReferrerOfVerification(
  referrerId: string,
  verifiedUserId: string
): Promise<void> {
  try {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) return;

    const [{ data: referrer }, { data: verified }] = await Promise.all([
      supabaseAdmin
        .from('waitlist')
        .select('telegram_id, full_name, referral_code')
        .eq('id', referrerId)
        .maybeSingle(),
      supabaseAdmin
        .from('waitlist')
        .select('full_name')
        .eq('id', verifiedUserId)
        .maybeSingle(),
    ]);

    const telegramId = referrer?.telegram_id;
    if (!telegramId) return;

    const referrerName = (referrer?.full_name || 'Someone').split(' ')[0];
    const verifiedName = (verified?.full_name || 'A friend').split(' ')[0];

    await sendTelegramMessage(
      botToken,
      String(telegramId),
      `🎉 <b>${verifiedName}</b> just verified on Uni UI!<br/><br/>Keep sharing your link to unlock more rewards. Your current progress has been updated.`,
      'HTML'
    );
  } catch (e) {
    console.error('[rewards/notify] failed to notify referrer', referrerId, e);
  }
}

// ---------------------------------------------------------------------------
// Admin controls
// ---------------------------------------------------------------------------
export async function adjustBonusReferrals(codeOrPhone: string, delta: number) {
  const user = await resolveUser(codeOrPhone);
  if (!user) return { ok: false as const, reason: 'not_found' };

  const { data: wl } = await supabaseAdmin
    .from('waitlist')
    .select('bonus_referrals')
    .eq('id', user.id)
    .maybeSingle();
  const current = wl?.bonus_referrals || 0;
  const next = Math.max(0, current + delta);

  await supabaseAdmin.from('waitlist').update({ bonus_referrals: next }).eq('id', user.id);
  if (delta > 0) await awardMysteryBoxes(user.id);

  return { ok: true as const, bonusReferrals: next };
}

export async function disqualifyUser(codeOrPhone: string, disqualified: boolean) {
  const user = await resolveUser(codeOrPhone);
  if (!user) return { ok: false as const, reason: 'not_found' };
  await supabaseAdmin
    .from('waitlist')
    .update({ disqualified, status: disqualified ? 'disqualified' : 'active' })
    .eq('id', user.id);
  return { ok: true as const, disqualified };
}

/**
 * Reset giveaway: clear boxes, tickets, wallet, payments, spin history,
 * referrals and granted reward tiers.
 *
 * `referral_rewards` is included — leaving it behind meant a user kept every
 * tier they had already claimed after a reset, so those tiers could never be
 * re-earned or re-granted.
 */
export async function resetGiveaway() {
  const tables = ['mystery_boxes', 'spin_history', 'payments', 'referrals', 'referral_rewards'];
  for (const t of tables) {
    // referral_rewards may not be deployed in every environment; ignore misses.
    const { error } = await supabaseAdmin
      .from(t)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.warn(`[resetGiveaway] could not clear ${t}:`, error.message);
  }
  await supabaseAdmin
    .from('waitlist')
    .update({
      mystery_boxes: 0,
      spin_tickets: 0,
      wallet_balance: 0,
      wallet_paid: 0,
      bonus_referrals: 0,
      telegram_verified: false,
      telegram_id: null,
      telegram_username: null,
    })
    .neq('id', '00000000-0000-0000-0000-000000000000');
  return { ok: true as const };
}
