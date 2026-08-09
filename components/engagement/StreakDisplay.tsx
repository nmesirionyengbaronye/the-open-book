'use client';

import { Flame, CalendarDays } from 'lucide-react';

export default function StreakDisplay({ current, longest }: { current: number; longest: number }) {
  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2 text-white/60">
        <Flame className="h-4 w-4 text-orange-400" />
        <span className="text-xs font-medium">Current streak</span>
      </div>
      <div className="mt-1 text-lg font-bold text-white">{current} days</div>
      <div className="mt-1 flex items-center gap-1 text-[11px] text-white/40">
        <CalendarDays className="h-3 w-3" />
        Best: {longest} days
      </div>
      {current > 0 && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
          <div
            className="h-1.5 rounded-full bg-orange-400 transition-all"
            style={{ width: `${Math.min(100, current * 14.28)}%` }}
          />
        </div>
      )}
    </div>
  );
}
