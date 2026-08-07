export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (ctx: BadgeContext) => boolean;
};

export type BadgeContext = {
  referralCount: number;
  rank: number | null;
  totalWaitlist: number;
};

export const BADGES: Badge[] = [
  {
    id: 'first-share',
    name: 'Giveaway',
    description: 'Referred 7 friends and unlocked giveaway entry',
    icon: 'Share2',
    condition: ({ referralCount }) => referralCount >= 7,
  },
  {
    id: 'networker',
    name: 'Networker',
    description: 'Referred 25 coursemates',
    icon: 'Users',
    condition: ({ referralCount }) => referralCount >= 25,
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Referred 50 coursemates',
    icon: 'Trophy',
    condition: ({ referralCount }) => referralCount >= 50,
  },
  {
    id: 'campus-king',
    name: 'Campus King',
    description: 'Referred 100 coursemates',
    icon: 'Crown',
    condition: ({ referralCount }) => referralCount >= 100,
  },
  {
    id: 'top-10',
    name: 'Top 10',
    description: 'Ranked in the top 10 on the leaderboard',
    icon: 'Medal',
    condition: ({ rank }) => rank !== null && rank <= 10 && rank > 0,
  },
];

export function getEarnedBadges(ctx: BadgeContext): Badge[] {
  return BADGES.filter((b) => b.condition(ctx));
}

export function getNextBadge(ctx: BadgeContext): Badge | null {
  const earned = getEarnedBadges(ctx);
  return BADGES.find((b) => !earned.some((e) => e.id === b.id)) || null;
}
