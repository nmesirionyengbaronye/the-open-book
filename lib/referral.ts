import { TIERS } from '@/lib/tiers';

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number | null;
  condition: (ctx: BadgeContext) => boolean;
};

export type BadgeContext = {
  /** Canonical referral count — see lib/referral-counts.ts. */
  referralCount: number;
  rank: number | null;
  totalWaitlist: number;
};

/**
 * Badges are generated from the single TIERS table so a badge can never promise
 * a different threshold than the reward it unlocks.
 */
export const BADGES: Badge[] = [
  ...TIERS.map((t) => ({
    id: t.badgeId,
    name: t.title,
    description: t.description,
    icon: t.icon,
    threshold: t.threshold,
    condition: ({ referralCount }: BadgeContext) => referralCount >= t.threshold,
  })),
  {
    id: 'top-10',
    name: 'Top 10',
    description: 'Ranked in the top 10 on the leaderboard',
    icon: 'Medal',
    threshold: null,
    condition: ({ rank }: BadgeContext) => rank !== null && rank <= 10 && rank > 0,
  },
];

export function getEarnedBadges(ctx: BadgeContext): Badge[] {
  return BADGES.filter((b) => b.condition(ctx));
}

export function getNextBadge(ctx: BadgeContext): Badge | null {
  const earned = getEarnedBadges(ctx);
  return BADGES.find((b) => !earned.some((e) => e.id === b.id)) || null;
}

/** Referrals still needed for `badge`, or null when it isn't count-based. */
export function referralsToBadge(badge: Badge | null, referralCount: number): number | null {
  if (!badge || badge.threshold === null) return null;
  return Math.max(0, badge.threshold - referralCount);
}

/** Progress (0–100) towards `badge`. */
export function badgeProgressPercent(badge: Badge | null, referralCount: number): number {
  if (!badge || badge.threshold === null || badge.threshold <= 0) return 0;
  return Math.min(100, (referralCount / badge.threshold) * 100);
}
