'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Gift, Crown, Flame } from 'lucide-react';

const PRIZES = [
  { rank: 'Top 3', reward: 'Exclusive early access + branded swag', icon: Trophy },
  { rank: 'Top 10', reward: 'Founding member badge + priority queue', icon: Medal },
  { rank: 'Top 25', reward: 'Free semester credits', icon: Gift },
  { rank: 'Top 100', reward: 'Lifetime access unlock', icon: Crown },
];

export function ReferralContest() {
  const [referrals, setReferrals] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/waitlist/stats')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && typeof data?.total === 'number') {
          setReferrals(data.total);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-20 px-5 bg-surface/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">Contest</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">
            Referral <span className="text-gold">contest</span> is live
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            The more friends you bring, the higher you climb. Top referrers unlock exclusive rewards.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total referrals</div>
            <div className="mt-2 text-4xl font-display font-bold text-gold">{referrals.toLocaleString()}</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">First prize</div>
            <div className="mt-2 text-4xl font-display font-bold text-gold">15</div>
            <div className="text-xs text-muted-foreground">Giveaway entry</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Grand prize</div>
            <div className="mt-2 text-4xl font-display font-bold text-gold">100</div>
            <div className="text-xs text-muted-foreground">Lifetime access</div>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-gold/20">
          <h3 className="font-display text-xl font-semibold mb-4">Prize tiers</h3>
          <div className="space-y-3">
            {PRIZES.map((prize) => {
              const Icon = prize.icon;
              return (
                <div key={prize.rank} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/15 grid place-items-center">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-gold">{prize.rank}</div>
                      <div className="text-sm text-muted-foreground">{prize.reward}</div>
                    </div>
                  </div>
                  <Trophy className="w-5 h-5 text-gold/60" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
