'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";

export function Leaderboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/waitlist/stats")
      .then(r => r.json())
      .then(data => {
        setEntries(data.topReferrers || []);
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const top = entries.slice(0, 10);

  return (
    <section id="leaderboard" className="py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Top Sharers</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight leading-[0.95]">
            <Trophy className="inline w-7 h-7 mr-2 -mt-1" />Leaderboard
          </h2>
        </div>
        <div className="rounded-2xl border border-black/10 bg-black/5 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
        {loading ? (
            <div className="p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-black/10 last:border-0">
                  <div className="w-8 h-8 rounded-full shimmer" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 shimmer rounded" style={{ width: `${40 + (i * 13) % 40}%` }} />
                    <div className="h-2 shimmer rounded" style={{ width: `${20 + (i * 17) % 30}%` }} />
                  </div>
                  <div className="h-6 w-12 shimmer rounded" />
                </div>
              ))}
            </div>
          ) : top.length === 0 ? (
            <div className="p-10 text-center">
              <Medal className="w-10 h-10 mx-auto text-black/60" />
              <p className="mt-3 text-black/70">
                No referrers yet. Share your link with coursemates and be the first to climb the queue!
              </p>
              <a href="/join" className="mt-4 inline-block text-black underline underline-offset-2 text-sm">Get your referral link</a>
            </div>
          ) : (
            <motion.ul
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
 {top.map((e: any, i: number) => (
                <motion.li
                  key={e.code}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                  className="flex items-center gap-4 px-5 py-4 border-b border-black/10 last:border-0 hover:bg-black/5 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-full grid place-items-center font-display font-bold ${
                    i === 0 ? "bg-black text-[#FFD93D]" :
                    i === 1 ? "bg-black/80 text-[#FFD93D]" :
                    i === 2 ? "bg-black/60 text-[#FFD93D]" : "bg-black/10 text-black"
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-black truncate">{e.name || e.code}</div>
                     <div className="text-xs text-black/70">{e.count} referrals</div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
    </section>
  );
}
