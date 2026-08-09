'use client';

import { Trophy, Star, Flame, Calendar, PackageOpen, Sparkles, Wallet } from 'lucide-react';
import type { RewardsProfile } from '@/components/rewards/types';
import ConfettiCelebration from './ConfettiCelebration';

const icons: Record<string, React.ReactNode> = {
  first_join: <Star className="h-5 w-5" />,
  first_referral: <Trophy className="h-5 w-5" />,
  five_referrals: <Star className="h-5 w-5" />,
  ten_referrals: <Flame className="h-5 w-5" />,
  fifteen_referrals: <Trophy className="h-5 w-5" />,
  twenty_referrals: <Trophy className="h-5 w-5" />,
  telegram_verified: <Star className="h-5 w-5" />,
  streak_3: <Flame className="h-5 w-5" />,
  streak_7: <Calendar className="h-5 w-5" />,
  box_opener: <PackageOpen className="h-5 w-5" />,
  spinner: <Sparkles className="h-5 w-5" />,
  winner: <Wallet className="h-5 w-5" />,
};

export default function BadgeShowcase({
  profile,
  badges,
  celebrations,
  onShare,
}: {
  profile: RewardsProfile | null;
  badges: { key: string; label: string; emoji: string; color: string }[];
  celebrations: number[];
  onShare?: () => void;
}) {
  if (!profile) return null;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-[#D4AF37]">Badges</h3>
        {onShare && (
          <button onClick={onShare} className="text-[11px] text-white/50 hover:text-[#D4AF37]">
            Share card
          </button>
        )}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.key}
            className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center"
          >
            <div
              className="grid h-10 w-10 place-items-center rounded-full text-lg"
              style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
            >
              {badge.emoji}
            </div>
            <div className="text-[10px] font-medium text-white/80">{badge.label}</div>
          </div>
        ))}
        {badges.length === 0 && (
          <p className="col-span-full text-[11px] text-white/40">No badges yet — keep engaging to earn them.</p>
        )}
      </div>
      {celebrations.length > 0 && (
        <div className="mt-3 text-[11px] text-white/40">
          Milestones celebrated: {celebrations.join(', ')}
        </div>
      )}
    </div>
  );
}
