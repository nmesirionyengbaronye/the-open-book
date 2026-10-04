'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Gift, Crown, Flame } from 'lucide-react';
import { TIERS, GIVEAWAY_ENTRY_THRESHOLD } from '@/lib/tiers';

// Prize tiers are derived from the shared TIERS table so the referral counts
// advertised here always match the badges and the claim API.
const ICONS = [Trophy, Medal, Gift, Crown, Flame];
const PRIZES = TIERS.map((t, i) => ({
  threshold: t.threshold,
  reward: t.title,
  icon: ICONS[i % ICONS.length],
}));

const GRAND_PRIZE = TIERS[TIERS.length - 1];

export function ReferralContest() {
  const [referrals, setReferrals] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/waitlist/stats')
      .then((r) => r.json())
      .then((data) => {
        // `totalReferrals` = people who joined via someone's link.
        // (`data.total` is the whole waitlist and must not be used here.)
        if (!cancelled && typeof data?.totalReferrals === 'number') {
          setReferrals(data.totalReferrals);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-20 px-5 bg-[#FFD93D]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-black/80 uppercase">Contest</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold text-black">
            Referral <span className="text-black">contest</span> is live
          </h2>
          <p className="mt-3 text-black/70 max-w-xl mx-auto">
            The more friends you bring, the higher you climb. Top referrers unlock exclusive rewards.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10">
            <div className="text-[10px] uppercase tracking-widest text-black/70">Total referrals</div>
            <div className="mt-2 text-4xl font-display font-bold text-black">{referrals.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10">
            <div className="text-[10px] uppercase tracking-widest text-black/70">First prize</div>
            <div className="mt-2 text-4xl font-display font-bold text-black">{GIVEAWAY_ENTRY_THRESHOLD}</div>
            <div className="text-xs text-black/70">Giveaway entry</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10">
            <div className="text-[10px] uppercase tracking-widest text-black/70">Grand prize</div>
            <div className="mt-2 text-4xl font-display font-bold text-black">{GRAND_PRIZE.threshold}</div>
            <div className="text-xs text-black/70">{GRAND_PRIZE.title}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
          <h3 className="font-display text-xl font-semibold mb-4 text-black">Prize tiers</h3>
          <div className="space-y-3">
            {PRIZES.map((prize) => {
              const Icon = prize.icon;
              return (
                <div key={prize.threshold} className="flex items-center justify-between rounded-xl bg-[#FFD93D] p-4 border border-black/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black grid place-items-center">
                      <Icon className="w-5 h-5 text-[#FFD93D]" />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-black">
                        {prize.threshold} verified referrals
                      </div>
                      <div className="text-sm text-black/70">{prize.reward}</div>
                    </div>
                  </div>
                  <Trophy className="w-5 h-5 text-black/60" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
