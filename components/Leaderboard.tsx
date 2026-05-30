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
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">Top Sharers</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">
            <Trophy className="inline w-7 h-7 text-gold mr-2 -mt-1" />Leaderboard
          </h2>
        </div>
        <div className="glass-strong rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5">
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
              <Medal className="w-10 h-10 mx-auto text-gold/60" />
              <p className="mt-3 text-muted-foreground font-hand">
                I'm building this alone right now. Be the first to share your link and earn the top spot before the rush begins.
              </p>
              <a href="/join" className="mt-4 inline-block text-gold text-sm underline">Get your referral link →</a>
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
                  className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-gold/5 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-full grid place-items-center font-display font-bold ${
                    i === 0 ? "bg-gold text-background" :
                    i === 1 ? "bg-zinc-300 text-background" :
                    i === 2 ? "bg-amber-700 text-background" : "bg-white/5 text-muted-foreground"
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{e.code}</div>
                    <div className="text-xs text-muted-foreground">{e.count} referrals</div>
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