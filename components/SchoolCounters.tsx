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

  if (loading || !data || !data.schools) {
    return (
      <section className="py-20 px-5 bg-[#FFD93D]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs tracking-[0.3em] text-black/80 uppercase">By School</div>
            <h2 className="mt-3 text-2xl font-display font-bold text-black">Loading schools…</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-24 animate-pulse border border-black/10" />
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
    <section className="py-20 px-5 bg-[#FFD93D]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-black/80 uppercase">By School</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold text-black">
            WHO'S JOINING THE WAITLIST
          </h2>
          <p className="mt-3 text-sm text-black/70">
            {data.total.toLocaleString()} students across {data.schools.length} schools.
            {liveSchools.length > 0 && (
              <>
                {' '}<span className="text-emerald-600 font-semibold">{liveSchools[0].name}</span> is live —{' '}
                <span className="text-black font-semibold">{liveSchools[0].count.toLocaleString()}</span> already there.
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
            className="mb-8 rounded-2xl border border-emerald-400/40 bg-white p-5 flex items-center justify-between shadow-[4px_4px_0px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 grid place-items-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold text-black">{liveSchools[0].name}</div>
                <div className="text-xs text-black/70">Live now — join the app</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-display font-bold text-emerald-600">{liveSchools[0].count}</div>
              <div className="text-[10px] text-emerald-600/70 uppercase tracking-wider">students</div>
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
              className="bg-white rounded-xl p-4 hover:border-black/30 transition-colors border border-black/10 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FFD93D] grid place-items-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-black" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-black truncate">
                      {school.name}
                    </div>
                    <div className="text-[10px] text-black/70 uppercase tracking-wider">
                      {school.code} · {school.count.toLocaleString()} students
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Users className="w-3.5 h-3.5 text-black/60" />
                  <span className="text-black font-display font-bold">{school.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-black/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max((school.count / maxCount) * 100, 2)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full bg-black"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {data.total > 0 && (
          <p className="mt-6 text-center text-xs text-black/70">
            Join your school to push it higher. The first 6 non-FUTO schools go live November 2026 —
            <Link href="/join" className="text-black font-semibold hover:underline ml-1">join now</Link>
          </p>
        )}
      </div>
    </section>
  );
}
