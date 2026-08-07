import { supabaseAdmin } from '@/lib/supabase';
import { normalizeWhatsApp } from '@/lib/validation';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MILESTONE = 7; // verified referrals per mystery box

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
const PRIZES = [200, 500, 1000, 2000, 5000, 10000];
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

function isLikelyPhone(value: string): boolean {
  return /^\+?\d{10,15}$/.test(value.replace(/\s/g, ''));
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
// ---------------------------------------------------------------------------
export async function getVerifiedReferralCount(userId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', userId)
    .eq('status', 'verified');
  return count || 0;
}

/** Effective referral count = verified referrals + admin bonus. */
export async function getEffectiveReferralCount(userId: string): Promise<number> {
  const base = await getVerifiedReferralCount(userId);
  const { data } = await supabaseAdmin
    .from('waitlist')
    .select('bonus_referrals')
    .eq('id', userId)
    .maybeSingle();
  return base + (data?.bonus_referrals || 0);
}

export async function getRank(userId: string): Promise<number | null> {
  const { data, error } = await supabaseAdmin
    .from('referral_counts')
    .select('referrer_id, verified_count')
    .order('verified_count', { ascending: false });
  if (error || !data) return null;
  const idx = (data as { referrer_id: string; verified_count: number }[]).findIndex(
    (r) => r.referrer_id === userId
  );
  return idx >= 0 ? idx + 1 : null;
}

export type LeaderboardEntry = {
  rank: number;
  name: string;
  code: string;
  referrals: number;
  isCurrentUser: boolean;
};

export async function getLeaderboard(currentUserId?: string): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabaseAdmin
    .from('referral_counts')
    .select('referrer_id, verified_count')
    .order('verified_count', { ascending: false })
    .limit(20);
  if (error || !data) return [];

  const ids = (data as { referrer_id: string }[]).map((r) => r.referrer_id);
  const { data: users } = await supabaseAdmin
    .from('waitlist')
    .select('id, full_name, referral_code, disqualified')
    .in('id', ids);

  const userMap = new Map(
    (users || []).map((u: any) => [u.id, u])
  );

  return (data as { referrer_id: string; verified_count: number }[])
    .filter((r) => !userMap.get(r.referrer_id)?.disqualified)
    .map((r, i) => {
      const u = userMap.get(r.referrer_id);
      return {
        rank: i + 1,
        name: u?.full_name || 'Anonymous',
        code: u?.referral_code || '',
        referrals: r.verified_count,
        isCurrentUser: r.referrer_id === currentUserId,
      };
    });
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
  verifiedReferrals: number;
  effectiveReferrals: number;
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
      'referral_code, full_name, mystery_boxes, spin_tickets, wallet_balance, wallet_paid, disqualified, telegram_verified'
    )
    .eq('id', user.id)
    .maybeSingle();
  if (!wl) return null;

  const verified = await getVerifiedReferralCount(user.id);
  const effective = await getEffectiveReferralCount(user.id);
  const rank = await getRank(user.id);
  const boxesOpened = wl.mystery_boxes || 0;
  const boxesDue = Math.floor(effective / MILESTONE);
  const walletBalance = wl.wallet_balance || 0;
  const walletPaid = wl.wallet_paid || 0;

  return {
    referralCode: wl.referral_code,
    fullName: wl.full_name,
    verifiedReferrals: verified,
    effectiveReferrals: effective,
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

  if (pending && pending.length) {
    await supabaseAdmin
      .from('referrals')
      .update({ status: 'verified', verified_at: new Date().toISOString() })
      .eq('referred_id', user.id)
      .eq('status', 'pending');

    for (const p of pending as { referrer_id: string }[]) {
      await awardMysteryBoxes(p.referrer_id);
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

export async function markPayment(
  codeOrPhone: string,
  amount: number,
  reference: string
) {
  const user = await resolveUser(codeOrPhone);
  if (!user) return { ok: false as const, reason: 'not_found' };

  const { data: inserted } = await supabaseAdmin
    .from('payments')
    .insert({
      user_id: user.id,
      amount,
      status: 'paid',
      reference: reference || null,
      paid_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle();

  if (!inserted) return { ok: false as const, reason: 'insert_failed' };

  // Recompute wallet_paid = sum of paid payments for this user.
  const { data: paidRows } = await supabaseAdmin
    .from('payments')
    .select('amount')
    .eq('user_id', user.id)
    .eq('status', 'paid');

  const totalPaid = (paidRows || []).reduce((s: number, r: any) => s + (r.amount || 0), 0);
  await supabaseAdmin
    .from('waitlist')
    .update({ wallet_paid: totalPaid })
    .eq('id', user.id);

  // Mark matching unpaid spin_history as paid (oldest first) up to amount.
  // (Administrative simplification: payment settles wallet, not individual spins.)
  return { ok: true as const, paymentId: inserted.id, totalPaid };
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
    .limit(limit);
  if (!data || data.length === 0) return [];
  const ids = (data as { user_id: string }[]).map((r) => r.user_id);
  const { data: users } = await supabaseAdmin
    .from('waitlist')
    .select('id, full_name, referral_code')
    .in('id', ids);
  const userMap = new Map((users || []).map((u: any) => [u.id, u]));
  return (data as any[]).map((r) => {
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
    .select('full_name, referral_code, wallet_balance')
    .order('wallet_balance', { ascending: false })
    .limit(limit);
  return (data || []).map((r: any) => ({
    name: r.full_name || 'Anonymous',
    code: r.referral_code || '',
    balance: r.wallet_balance || 0,
  }));
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
  const { data } = await supabaseAdmin.from('referral_counts').select('verified_count');
  if (!data) return 0;
  return (data as { verified_count: number }[]).reduce(
    (sum, r) => sum + 500 * Math.floor((r.verified_count || 0) / MILESTONE),
    0
  );
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

/** Reset giveaway: clear boxes, tickets, wallet, payments, spin history, referrals. */
export async function resetGiveaway() {
  const tables = ['mystery_boxes', 'spin_history', 'payments', 'referrals'];
  for (const t of tables) {
    await supabaseAdmin.from(t).delete().neq('id', '00000000-0000-0000-0000-000000000000');
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
