'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Crown, Medal, Coins, Users } from 'lucide-react';
import { Loader2 } from 'lucide-react';

type Winner = {
  name: string;
  code: string;
  winnings: number;
  referrals: number;
};

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rewards/winners')
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setWinners(d || []))
      .catch(() => setWinners([]))
      .finally(() => setLoading(false));
  }, []);

  const podium = winners.slice(0, 3);
  const rest = winners.slice(3);

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-5 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/15">
            <Trophy className="h-7 w-7 text-[#D4AF37]" />
          </div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Hall of <span className="text-[#D4AF37]">Fame</span>
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Our top referrers — climbing the leaderboard, winning cash, and inviting coursemates.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
          </div>
        ) : winners.length === 0 ? (
          <p className="mt-16 text-center text-sm text-white/50">
            No winners yet. Be the first to refer and win!
          </p>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-3 items-end gap-3">
              {podium.map((w, i) => {
                const rank = i + 1;
                const heights = ['h-28', 'h-36', 'h-24'];
                const Icon = rank === 1 ? Crown : Medal;
                return (
                  <div
                    key={w.code}
                    className="flex flex-col items-center rounded-2xl border border-[#D4AF37]/30 bg-white/5 p-4"
                  >
                    <Icon
                      className={`mb-2 h-6 w-6 ${
                        rank === 1 ? 'text-yellow-300' : 'text-[#D4AF37]'
                      }`}
                    />
                    <div
                      className={`mb-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#D4AF37]/30 to-transparent ${heights[i]}`}
                    >
                      <span className="font-display text-2xl font-bold text-[#D4AF37]">
                        {w.winnings > 0 ? `₦${w.winnings.toLocaleString()}` : `#${rank}`}
                      </span>
                    </div>
                    <p className="truncate text-sm font-medium">{w.name}</p>
                    <p className="flex items-center gap-1 text-xs text-white/50">
                      <Users className="h-3 w-3" /> {w.referrals}
                    </p>
                  </div>
                );
              })}
            </div>

            {rest.length > 0 && (
              <ul className="mt-6 space-y-2">
                {rest.map((w, i) => (
                  <li
                    key={w.code}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs text-white/40">#{i + 4}</span>
                      <span className="font-medium">{w.name}</span>
                    </span>
                    <span className="flex items-center gap-4 text-white/70">
                      <span className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" /> {w.referrals}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[#D4AF37]">
                        <Coins className="h-3 w-3" /> ₦{w.winnings.toLocaleString()}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-black"
          >
            Back to UniUI
          </Link>
        </div>
      </div>
    </main>
  );
}
