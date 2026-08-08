/**
 * Single source of truth for "what is a referral".
 *
 * Before this module existed the app had four competing definitions:
 *   1. count of `waitlist.referred_by`            (web stat, web rank, homepage board)
 *   2. count of `referrals` where status=verified (Telegram stat, `referral_counts` view)
 *   3. verified + `bonus_referrals`               (spins / boxes / launch tokens)
 *   4. the `referral_counts` view, bonus excluded (rank + rewards leaderboard)
 *
 * They are now all expressed as one canonical scope.
 *
 * CANONICAL DECISION: a referral only counts once it is VERIFIED — never while
 * pending. A person who joins through your link shows up under "friends who
 * joined via your link" immediately, but cannot unlock the spin wheel, mystery
 * boxes, badges, rank or leaderboard position until they verify (Telegram
 * confirm). `joinedCount` is the raw join figure kept for that one display.
 *
 *   7 verified referrals  ->  1 spin + 1 mystery box (see MILESTONE)
 *
 * `bonus_referrals` (granted by an admin) counts everywhere, so a bonus moves
 * the user up the leaderboard as well as unlocking boxes.
 */

import { supabaseAdmin } from '@/lib/supabase';

/** Verified referrals per mystery box / spin ticket, and the giveaway-entry gate. */
export const MILESTONE = 7;

export type ReferralScope =
  /** Canonical: verified referrals + admin bonus. Use this by default. */
  | 'canonical'
  /** Joined only (waitlist.referred_by), no bonus. For "N joined via your link" copy. */
  | 'joined'
  /** Telegram-verified `referrals` rows only, no bonus. Diagnostics. */
  | 'verified';

// ---------------------------------------------------------------------------
// Primitive counts
// ---------------------------------------------------------------------------

/** People who joined the waitlist through this user's referral code (any status). */
export async function getJoinedReferralCount(referralCode: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', referralCode);
  return count || 0;
}

/**
 * `referrals` rows promoted to verified (the friend confirmed on Telegram).
 * This is the only count that unlocks spins / boxes / badges / rank.
 */
export async function getVerifiedReferralCount(userId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', userId)
    .eq('status', 'verified');
  return count || 0;
}

/** Admin-granted bonus referrals. */
export async function getBonusReferrals(userId: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('waitlist')
    .select('bonus_referrals')
    .eq('id', userId)
    .maybeSingle();
  return data?.bonus_referrals || 0;
}

// ---------------------------------------------------------------------------
// Canonical count
// ---------------------------------------------------------------------------

/**
 * THE referral count. Every stat, badge, rank, leaderboard, progress bar and
 * spin/box grant must go through this so they can never disagree.
 *
 * Canonical = verified referrals (+ admin bonus). Pending referrals are NOT
 * counted — they stay pending until the referred user verifies.
 */
export async function getReferralCount(
  user: { id: string; referralCode: string },
  scope: ReferralScope = 'canonical'
): Promise<number> {
  if (scope === 'joined') return getJoinedReferralCount(user.referralCode);
  if (scope === 'verified') return getVerifiedReferralCount(user.id);

  // canonical
  return (await getVerifiedReferralCount(user.id)) + (await getBonusReferrals(user.id));
}

// ---------------------------------------------------------------------------
// Ranking / leaderboard — one shared computation
// ---------------------------------------------------------------------------

export type RankedReferrer = {
  userId: string;
  referralCode: string;
  fullName: string;
  /** Canonical (verified + bonus). */
  count: number;
  /** Raw joins via this code, for display only. */
  joinedCount: number;
};

/**
 * Canonical ranking table, highest first, disqualified users removed.
 *
 * Built from the `referrals` table so pending rows never contribute to rank.
 */
export async function getRankedReferrers(): Promise<RankedReferrer[]> {
  const { data: users, error } = await supabaseAdmin
    .from('waitlist')
    .select('id, referral_code, full_name, bonus_referrals, disqualified');
  if (error || !users) return [];

  const rows = users as {
    id: string;
    referral_code: string;
    full_name: string | null;
    bonus_referrals: number | null;
    disqualified: boolean | null;
  }[];

  // Verified referrals per referrer (pending excluded).
  const { data: verified } = await supabaseAdmin
    .from('referrals')
    .select('referrer_id')
    .eq('status', 'verified');
  const verifiedByUser = new Map<string, number>();
  for (const r of verified || []) {
    const id = (r as { referrer_id: string }).referrer_id;
    verifiedByUser.set(id, (verifiedByUser.get(id) || 0) + 1);
  }

  // Raw joins per referrer (display only).
  const { data: joined } = await supabaseAdmin
    .from('waitlist')
    .select('referred_by')
    .not('referred_by', 'is', null);
  const joinedByCode = new Map<string, number>();
  for (const r of joined || []) {
    const code = (r as { referred_by: string }).referred_by;
    joinedByCode.set(code, (joinedByCode.get(code) || 0) + 1);
  }

  const codeById = new Map(rows.map((u) => [u.id, u.referral_code]));

  return filterDisqualified(rows)
    .map((u) => ({
      userId: u.id,
      referralCode: u.referral_code,
      fullName: u.full_name || 'Anonymous',
      count: (verifiedByUser.get(u.id) || 0) + (u.bonus_referrals || 0),
      joinedCount: joinedByCode.get(u.referral_code) || 0,
    }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count || a.referralCode.localeCompare(b.referralCode));
}

/** Canonical rank (1-based), or null when the user has no referrals yet. */
export async function getRankFromBoard(userId: string): Promise<number | null> {
  const board = await getRankedReferrers();
  const idx = board.findIndex((r) => r.userId === userId);
  return idx >= 0 ? idx + 1 : null;
}

/**
 * Drop disqualified users from any result set. Applied centrally so public and
 * admin reads can never diverge on who is eligible.
 */
export function filterDisqualified<T extends { disqualified?: boolean | null }>(
  rows: T[]
): T[] {
  return rows.filter((r) => !r.disqualified);
}
