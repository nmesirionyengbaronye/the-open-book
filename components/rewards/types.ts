export type RewardsProfile = {
  referralCode: string;
  fullName: string;
  verifiedReferrals: number;
  effectiveReferrals: number;
  joinedCount: number;
  rank: number | null;
  boxesDue: number;
  boxesOpened: number;
  spinTickets: number;
  walletBalance: number;
  walletPaid: number;
  walletPending: number;
  launchTokens: number;
  launchCountdownDays: number;
  disqualified: boolean;
  telegramVerified: boolean;
  referralLinkExpiresAt: string | null;
};

export type ReferralItem = {
  status: string;
  status0?: string;
  verifiedAt: string | null;
  createdAt: string;
  name: string;
};

export type ReferralsResponse = {
  referrals: ReferralItem[];
  progress: {
    effective: number;
    milestone: number;
    completed: number;
    boxesDue: number;
    boxesOpened: number;
    need: number;
  };
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  code: string;
  referrals: number;
  isCurrentUser: boolean;
};

export type WalletInfo = {
  balance: number;
  paid: number;
  pending: number;
  history: { prize: number; paid: boolean; created_at: string }[];
};
