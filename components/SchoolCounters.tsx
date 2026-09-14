'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

interface SchoolCount {
  code: string;
  name: string;
  live: boolean;
  count: number;
}

interface SchoolData {
  schools: SchoolCount[];
  total: number;
}

const spring = { type: 'spring', stiffness: 100, damping: 12, mass: 0.5 } as const;

/**
 * Per-school waitlist counters. Displays "UNILAG: 142 students waiting"
 * style progress bars for the top schools. This is the highest-leverage
 * change on the waitlist — visible progress drives more signups.
 */
export function SchoolCounters() {
  const [data, setData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/waitlist/schools')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <section className="py-20 px-5 bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">By School</div>
            <h2 className="mt-3 text-2xl font-display font-bold">Loading schools…</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 h-24 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const topSchools = data.schools.filter((s) => !s.live).slice(0, 6);
  const liveSchools = data.schools.filter((s) => s.live);
  const maxCount = Math.max(...topSchools.map((s) => s.count), 1);

  return (
    <section className="py-20 px-5 bg-surface/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">By School</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">
            WHO'S JOINING THE WAITLIST
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {data.total.toLocaleString()} students across {data.schools.length} schools.
            {liveSchools.length > 0 && (
              <>
                {' '}<span className="text-emerald-400 font-semibold">{liveSchools[0].name}</span> is live —{' '}
                <span className="text-gold font-semibold">{liveSchools[0].count.toLocaleString()}</span> already there.
              </>
            )}
          </p>
        </div>

        {/* Live school callout */}
        {liveSchools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="mb-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 grid place-items-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-semibold text-emerald-200">{liveSchools[0].name}</div>
                <div className="text-xs text-muted-foreground">Live now — join the app</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-display font-bold text-emerald-400">{liveSchools[0].count}</div>
              <div className="text-[10px] text-emerald-400/60 uppercase tracking-wider">students</div>
            </div>
          </motion.div>
        )}

        {/* Waitlist school counters */}
        <div className="space-y-3">
          {topSchools.map((school, i) => (
            <motion.div
              key={school.code}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.05 }}
              className="glass rounded-xl p-4 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 grid place-items-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {school.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {school.code} · {school.count.toLocaleString()} students
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Users className="w-3.5 h-3.5 text-gold/60" />
                  <span className="text-gold font-display font-bold">{school.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max((school.count / maxCount) * 100, 2)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gold"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {data.total > 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Join your school to push it higher. The first 6 non-FUTO schools go live November 2026 —
            <Link href="/join" className="text-gold font-semibold hover:underline ml-1">join now</Link>
          </p>
        )}
      </div>
    </section>
  );
}
