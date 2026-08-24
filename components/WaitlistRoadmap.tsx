'use client';

import { motion } from 'framer-motion';
import { WAITLIST_ROADMAP, WAITLIST_FULL_COVERAGE_DATE, RoadmapPhase } from '@/lib/links';

const spring = { type: 'spring', stiffness: 100, damping: 12, mass: 0.5 } as const;

/**
 * Progressive rollout timeline for waitlisted Southern-Nigeria universities.
 * - Wave 1 (November 2026): 6 universities go live.
 * - Then 3 universities go live every month.
 * - August 2027: full coverage.
 */
export function WaitlistRoadmap() {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wider text-white/40">Rollout roadmap</span>
        <span className="text-xs text-gold/80">First wave: November 2026</span>
      </div>

      <div className="relative pl-[18px]">
        <div className="absolute left-[17px] top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-3">
          {WAITLIST_ROADMAP.map((phase, i) => {
            const first = i === 0;
            const isComplete = phase.complete;

            let dot: string;
            let label: string;
            let detail: string;
            if (first) {
              dot = 'bg-emerald-400';
              label = 'First wave live';
              detail = '6 universities go live on app.uniui.com.ng';
            } else if (isComplete) {
              dot = 'bg-gold';
              label = 'Full coverage';
              detail = `All Southern-Nigeria universities live by ${WAITLIST_FULL_COVERAGE_DATE}`;
            } else {
              dot = 'bg-white/20';
              label = 'Next wave';
              detail = `${phase.universities} more universities go live`;
            }

            return (
              <motion.div
                key={phase.key}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.04 }}
                className="relative flex items-start gap-3"
              >
                <span className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 rounded-full ${dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{phase.month}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="pt-1 text-[11px] text-white/40">
        A new wave of universities opens the first week of each month. Full Southern coverage by{' '}
        <span className="text-gold/80">{WAITLIST_FULL_COVERAGE_DATE}</span>.
      </div>
    </div>
  );
}

export type { RoadmapPhase };
