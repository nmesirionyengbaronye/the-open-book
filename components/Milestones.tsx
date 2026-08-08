'use client';

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";

// NOTE: these gates are keyed on TOTAL WAITLIST SIGNUPS, not on any one
// person's referral count. Referral tiers live in lib/tiers.ts.
const TIERS = [
  { at: 50, title: "WhatsApp study group opens", desc: "First 50 get a private room with the founder." },
  { at: 100, title: "Closed beta access", desc: "First 100 try the upload + ask flow before anyone else." },
  { at: 250, title: "Past-question vault unlocks", desc: "Crowd-sourced exam archive for all early members." },
  { at: 500, title: "Public beta launches", desc: "Open across FUTO, UNILAG, UI, and UNN." },
  { at: 1000, title: "Free semester credits", desc: "Every founding member gets a full semester of questions, free." },
];

export function Milestones() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/waitlist/stats")
      .then(r => r.json())
      .then(data => setTotal(data.total || 0))
      .catch(() => setTotal(0))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="milestones" className="py-20 px-5 bg-surface/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">Roadmap</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">Milestones we unlock together</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Community goals based on total waitlist signups — not your personal referral count.
          </p>
          {loading ? (
            <div className="mt-4 h-5 w-40 mx-auto shimmer rounded" />
          ) : (
            <p className="mt-3 text-muted-foreground">
              <span className="text-gold font-bold">{total}</span> students on board · next gate at{" "}
              <span className="text-gold font-bold">{TIERS.find((t) => total < t.at)?.at ?? "∞"}</span>
            </p>
          )}
        </div>
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <div className="h-4 w-2/3 shimmer rounded" />
                <div className="mt-3 h-2 w-full shimmer rounded-full" />
              </div>
            ))
            : TIERS.map((t) => <MilestoneRow key={t.at} tier={t} current={total} />)}
        </div>
      </div>
    </section>
  );
}

function MilestoneRow({ tier, current }: { tier: { at: number; title: string; desc: string }; current: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const pct = Math.min(100, Math.round((current / tier.at) * 100));
  const unlocked = current >= tier.at;
  return (
    <div ref={ref} className={`glass rounded-xl p-5 ${unlocked ? "border-gold/60 gold-glow" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {unlocked ? <CheckCircle2 className="w-4 h-4 text-gold" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
            <h3 className="font-display font-semibold">{tier.title}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{tier.desc}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-lg text-gold">{tier.at}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">signups</div>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as const }}
          className="h-full bg-gradient-to-r from-gold to-gold-bright"
        />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground text-right">{pct}%</div>
    </div>
  );
}