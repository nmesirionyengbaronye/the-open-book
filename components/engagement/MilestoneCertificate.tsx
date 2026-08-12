'use client';

import { Trophy, Users } from 'lucide-react';

export function generateShareImage(params: {
  name: string;
  referrals: number;
  rank?: number | null;
  milestone: number;
}) {
  const { name, referrals, rank, milestone } = params;
  const shareText = `🏆 ${name} on UniUI\n📊 ${referrals} verified referrals\n🏅 Rank: ${rank ? `#${rank}` : 'Unranked'}\n🎯 ${milestone} milestone reached\n\nJoin me: https://waitlist.uniui.com.ng`;

  if (typeof window === 'undefined') return shareText;

  const blob = new Blob([shareText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `uniui-milestone-${milestone}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  return shareText;
}

export default function MilestoneCertificate({
  name,
  referrals,
  rank,
  milestone,
}: {
  name: string;
  referrals: number;
  rank?: number | null;
  milestone: number;
}) {
  const handleShare = () => {
    generateShareImage({ name, referrals, rank, milestone });
  };

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 to-white/[0.02] p-6 text-center">
      <Trophy className="mx-auto h-10 w-10 text-[#D4AF37]" />
      <h3 className="mt-3 text-xl font-bold text-white">Milestone Reached!</h3>
      <p className="mt-1 text-sm text-white/70">
        {name} achieved {milestone} verified referrals
      </p>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/60">
        <div>
          <div className="text-lg font-bold text-white">{referrals}</div>
          <div className="text-[10px] uppercase tracking-widest">Referrals</div>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div>
          <div className="text-lg font-bold text-white">{rank ? `#${rank}` : '—'}</div>
          <div className="text-[10px] uppercase tracking-widest">Rank</div>
        </div>
      </div>
      <button
        onClick={handleShare}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black"
      >
        <Users className="h-4 w-4" /> Share achievement
      </button>
    </div>
  );
}
