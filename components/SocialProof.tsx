'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Flame, Trophy } from 'lucide-react';

export function SocialProof() {
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0, topReferrer: 0, verified: 0 });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/waitlist/stats')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setStats({
            total: data?.total || 0,
            today: data?.today || 0,
            week: data?.week || 0,
            topReferrer: data?.topReferrers?.[0]?.count || 0,
            verified: data?.verified || 0,
          });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-20 px-5 bg-surface/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">Social Proof</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">
            Join <span className="text-gold">{stats.total.toLocaleString()}</span> students already on the waitlist
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-6 text-center">
            <Users className="w-6 h-6 text-gold mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-gold">{stats.total.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total signups</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <TrendingUp className="w-6 h-6 text-gold mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-gold">{stats.today}</div>
            <div className="text-xs text-muted-foreground">Joined today</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <Flame className="w-6 h-6 text-gold mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-gold">{stats.week}</div>
            <div className="text-xs text-muted-foreground">This week</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <Trophy className="w-6 h-6 text-gold mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-gold">{stats.topReferrer}</div>
            <div className="text-xs text-muted-foreground">Top referrer count</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-emerald-400">{stats.verified.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Verified for rewards</div>
          </div>
        </div>
      </div>
    </section>
  );
}
