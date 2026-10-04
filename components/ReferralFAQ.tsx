'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I get my referral link?',
    a: 'Join the waitlist and you\'ll instantly get a unique referral code. Use it as /?ref=UNI-XXXX or open your dashboard to copy your personalized link.',
  },
  {
    q: 'How many referrals do I need for the giveaway?',
    a: 'The first giveaway unlocks at 7 verified referrals (then 1 spin per 7 referrals). Winners are announced on our WhatsApp community, so make sure you\'ve joined.',
  },
  {
    q: 'Do both the referrer and referee get benefits?',
    a: 'Yes. Every successful referral moves both the referrer and the referee up the queue. The more you share, the faster everyone moves.',
  },
  {
    q: 'Can I track who joined through my link?',
    a: 'Yes. Your dashboard shows recent invites, referral count, rank, badges, and streak.',
  },
  {
    q: 'What if someone shares my code multiple times?',
    a: 'Duplicate signups are blocked by WhatsApp number, so only real new signups count toward your referrals.',
  },
  {
    q: 'How do I claim my rewards?',
    a: 'When you hit a threshold, your reward unlocks in the dashboard. For giveaway entry, click "Go to WhatsApp" to claim your prize.',
  },
];

export function ReferralFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">FAQ</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight leading-[0.95]">
            Referral <span className="underline decoration-black/40 underline-offset-4">questions</span>, answered
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const active = open === i;
            return (
              <div key={i} className={`rounded-xl overflow-hidden transition-colors border ${active ? 'border-black/60 bg-black/5' : 'border-black/10 bg-black/5'}`}>
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-black flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-black shrink-0" />
                    {f.q}
                  </span>
                  <span className="text-black text-xs">{active ? '−' : '+'}</span>
                </button>
                {active && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-sm text-black/70 leading-relaxed">
                    {f.a}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
