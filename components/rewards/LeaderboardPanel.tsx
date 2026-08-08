import { Crown, Medal } from 'lucide-react';
import type { LeaderboardEntry } from './types';

function rankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-4 w-4 text-yellow-300" />;
  if (rank <= 3) return <Medal className="h-4 w-4 text-[#D4AF37]" />;
  return <span className="w-4 text-center text-xs text-white/40">#{rank}</span>;
}

export default function LeaderboardPanel({ entries }: { entries: LeaderboardEntry[] }) {
  if (!entries.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
        Leaderboard is empty for now.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-3 text-sm font-semibold text-white/80">Leaderboard — Top 20</h3>
      <p className="mb-2 text-[10px] text-white/40">Ranked by verified referrals</p>
      <ul className="space-y-1">
        {entries.map((e) => (
          <li
            key={e.code}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
              e.isCurrentUser ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'text-white/70'
            }`}
          >
            <span className="flex items-center gap-2">
              {rankIcon(e.rank)}
              <span className="truncate">{e.isCurrentUser ? 'You' : e.name}</span>
            </span>
            <span className="font-mono">{e.referrals}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
