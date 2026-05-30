'use client';

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Users, TrendingUp, Clock } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";

function CountUp({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
}

export function Status() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/waitlist/stats")
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const chartData = stats?.dailyData || [];

  return (
    <section id="status" className="py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">Live</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">The waitlist, right now</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {loading ? (
            <><StatSkeleton /><StatSkeleton /><StatSkeleton /></>
          ) : (
            <>
              <StatCard icon={Users} label="Total signups" value={stats.total} />
              <StatCard icon={Clock} label="Today" value={stats.today} />
              <StatCard icon={TrendingUp} label="This week" value={stats.week} />
            </>
          )}
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_280px] gap-6">
          <div className="glass-strong rounded-2xl p-5">
            <div className="text-sm font-medium mb-3">Signups · last 30 days</div>
            {loading ? (
              <div className="h-56 shimmer rounded-lg" />
            ) : (
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <XAxis dataKey="label" tick={{ fill: "oklch(0.65 0.02 90)", fontSize: 10 }} interval={4} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "oklch(0.78 0.13 85 / 0.08)" }}
                      contentStyle={{ background: "oklch(0.13 0.012 270)", border: "1px solid oklch(0.78 0.13 85 / 0.3)", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "oklch(0.78 0.13 85)" }}
                    />
                    <Bar dataKey="signups" fill="oklch(0.78 0.13 85)" radius={[4, 4, 0, 0]} animationDuration={900} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="glass-strong rounded-2xl p-5">
            <div className="text-sm font-medium mb-3">Most recent</div>
            {loading ? (
              <ul className="space-y-3">
                {Array.from({ length: 7 }).map((_, i) => <li key={i} className="h-8 shimmer rounded" />)}
              </ul>
            ) : stats.recentNames.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Be one of the first to join! The latest names will appear here.
              </p>
            ) : (
              <motion.ul
                initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.07 } } }}
                className="space-y-2"
              >
                {stats.recentNames.map((name: string, i: number) => (
                  <motion.li
                    key={i}
                    variants={{ h: { opacity: 0, x: -10 }, s: { opacity: 1, x: 0 } }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground/90">{name}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatSkeleton() {
  return (
    <div className="glass rounded-2xl p-6">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-4 h-10 w-32" />
      <Skeleton className="mt-3 h-2 w-24" />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="glass-strong rounded-2xl p-6 gold-glow-hover">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
        <Icon className="w-4 h-4 text-gold" /> {label}
      </div>
      <div className="mt-3 font-display text-4xl font-bold text-gold">
        <CountUp to={value} />
      </div>
      <div className="mt-1 h-1 w-12 rounded-full bg-gold/40" />
    </div>
  );
}