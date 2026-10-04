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
    <section id="milestones" className="py-20 px-5 bg-[#FFD93D]/10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Roadmap</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight leading-[0.95]">
            Milestones we unlock together
          </h2>
          <p className="mt-3 text-sm text-black/70">
            Community goals based on total waitlist signups — not your personal referral count.
          </p>
          {loading ? (
            <div className="mt-4 h-5 w-40 mx-auto shimmer rounded" />
          ) : (
            <p className="mt-3 text-black/70">
              <span className="text-black font-bold">{total}</span> students on board · next gate at{" "}
              <span className="text-black font-bold">{TIERS.find((t) => total < t.at)?.at ?? "∞"}</span>
            </p>
          )}
        </div>
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-black/5 p-5">
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
    <div ref={ref} className={`rounded-xl border border-black/10 bg-black/5 p-5 ${unlocked ? "border-black/60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {unlocked ? <CheckCircle2 className="w-4 h-4 text-black" /> : <Lock className="w-4 h-4 text-black/60" />}
            <h3 className="font-display font-semibold">{tier.title}</h3>
          </div>
          <p className="mt-1 text-sm text-black/70">{tier.desc}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-lg text-black">{tier.at}</div>
          <div className="text-[10px] uppercase tracking-wider text-black/70">signups</div>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-black/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as const }}
          className="h-full bg-black"
        />
      </div>
      <div className="mt-1 text-[10px] text-black/70 text-right">{pct}%</div>
    </div>
  );
}
