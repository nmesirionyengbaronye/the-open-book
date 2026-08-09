'use client';

import { Trophy, Users, Gift } from 'lucide-react';

export default function GroupChallenge({
  current,
  target,
  reward,
}: {
  current: number;
  target: number;
  reward: string;
}) {
  const progress = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="mt-5 rounded-xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 to-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        <Users className="h-4 w-4" />
        <h3 className="text-sm font-semibold tracking-wide">Group Challenge</h3>
      </div>
      <p className="mt-1 text-[11px] text-white/60">
        Get {target} verified friends to unlock: {reward}
      </p>
      <div className="mt-3 h-2 w-full rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-[#D4AF37] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-white/60">
        <span>{current} / {target} verified</span>
        <span>{progress}%</span>
      </div>
      {current >= target && (
        <div className="mt-3 flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-3 py-1.5 text-[11px] font-medium text-[#D4AF37]">
          <Trophy className="h-3.5 w-3.5" /> Challenge complete!
        </div>
      )}
    </div>
  );
}
