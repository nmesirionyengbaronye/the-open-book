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
    <main className="min-h-screen pt-24 pb-20 px-5 bg-[#FFD93D] text-black font-body antialiased">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
            <Trophy className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
            Hall of <span className="underline decoration-black/40 underline-offset-4">Fame</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            Our biggest cash winners, ranked by total winnings from the spin wheel.
          </p>
          <p className="mt-2 text-sm text-black/60">
            Referral counts are shown alongside each winner — they don’t determine this ranking.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-black" />
          </div>
        ) : winners.length === 0 ? (
          <p className="mt-16 text-center text-sm text-black/70">
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
                    className="flex flex-col items-center rounded-2xl border border-black/10 bg-black/5 p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]"
                  >
                    <Icon className="mb-2 h-6 w-6 text-black" />
                    <div
                      className={`mb-2 flex w-full items-center justify-center rounded-xl bg-black/10 ${heights[i]}`}
                    >
                      <span className="font-display text-2xl font-bold text-black">
                        {w.winnings > 0 ? `₦${w.winnings.toLocaleString()}` : `#${rank}`}
                      </span>
                    </div>
                    <p className="truncate text-sm font-medium">{w.name}</p>
                    <p className="flex items-center gap-1 text-xs text-black/70">
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
                    className="flex items-center justify-between rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs text-black/60">#{i + 4}</span>
                      <span className="font-medium">{w.name}</span>
                    </span>
                    <span className="flex items-center gap-4 text-black/80">
                      <span className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" /> {w.referrals}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-black">
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
            className="inline-flex items-center rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-[#FFD93D]"
          >
            Back to UniUI
          </Link>
        </div>
      </div>
    </main>
  );
}
