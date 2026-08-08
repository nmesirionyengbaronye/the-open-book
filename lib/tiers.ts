/**
 * One tier table for the whole app.
 *
 * Previously the thresholds lived in two places that disagreed:
 *   - REWARD_TIERS (app/api/referral/rewards/route.ts): 15/25/40/60/100
 *   - BADGES       (lib/referral.ts):                   7/25/50/100
 * so "giveaway entry" was simultaneously 15 (rewards API + contest UI) and
 * 7 (badge copy + tips copy + the actual spin engine).
 *
 * Resolved in favour of the spin engine: giveaway entry is MILESTONE (7),
 * because that is the number the mystery-box / spin-ticket grant already uses
 * and the number all user-facing copy promises.
 */

import { MILESTONE } from '@/lib/referral-counts';

export type Tier = {
  /** Stable id, persisted in `referral_rewards.reward_type`. */
  type: string;
  /** Referral count needed to unlock. */
  threshold: number;
  /** User-facing name. */
  title: string;
  /** Badge id, where the tier also grants a badge. */
  badgeId: string;
  /** lucide-react icon name. */
  icon: string;
  /** Badge description. */
  description: string;
};

export const TIERS: Tier[] = [
  {
    type: 'giveaway_entry',
    threshold: MILESTONE, // 7 — matches the spin/mystery-box milestone
    title: 'Giveaway Entry',
    badgeId: 'first-share',
    icon: 'Share2',
    description: `Referred ${MILESTONE} friends and unlocked giveaway entry`,
  },
  {
    type: 'early_access',
    threshold: 25,
    title: 'Early Access',
    badgeId: 'networker',
    icon: 'Users',
    description: 'Referred 25 coursemates',
  },
  {
    type: 'founding_member',
    threshold: 50,
    title: 'Founding Member',
    badgeId: 'influencer',
    icon: 'Trophy',
    description: 'Referred 50 coursemates',
  },
  {
    type: 'semester_credits',
    threshold: 75,
    title: 'Free Semester Credits',
    badgeId: 'scholar',
    icon: 'Gift',
    description: 'Referred 75 coursemates',
  },
  {
    type: 'lifetime_access',
    threshold: 100,
    title: 'Lifetime Access',
    badgeId: 'campus-king',
    icon: 'Crown',
    description: 'Referred 100 coursemates',
  },
];

export const GIVEAWAY_ENTRY_THRESHOLD = TIERS[0].threshold;

export function getTier(type: string): Tier | undefined {
  return TIERS.find((t) => t.type === type);
}

/** Tiers unlocked at a given canonical referral count. */
export function earnedTiers(referralCount: number): Tier[] {
  return TIERS.filter((t) => referralCount >= t.threshold);
}

/** The next tier still to unlock, or null when all are earned. */
export function nextTier(referralCount: number): Tier | null {
  return TIERS.find((t) => referralCount < t.threshold) || null;
}
