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
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">FAQ</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">
            Referral <span className="text-gold">questions</span>, answered
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const active = open === i;
            return (
              <div key={i} className={`glass rounded-xl overflow-hidden transition-colors ${active ? 'border-gold/60' : ''}`}>
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-gold shrink-0" />
                    {f.q}
                  </span>
                  <span className="text-gold text-xs">{active ? '−' : '+'}</span>
                </button>
                {active && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
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
