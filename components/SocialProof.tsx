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
    <section className="py-20 px-5 bg-[#FFD93D]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-black/80 uppercase">Social Proof</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold text-black">
            Join <span className="text-black">{stats.total.toLocaleString()}</span> students already on the waitlist
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10">
            <Users className="w-6 h-6 text-black mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-black">{stats.total.toLocaleString()}</div>
            <div className="text-xs text-black/70">Total signups</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10">
            <TrendingUp className="w-6 h-6 text-black mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-black">{stats.today}</div>
            <div className="text-xs text-black/70">Joined today</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10">
            <Flame className="w-6 h-6 text-black mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-black">{stats.week}</div>
            <div className="text-xs text-black/70">This week</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10">
            <Trophy className="w-6 h-6 text-black mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-black">{stats.topReferrer}</div>
            <div className="text-xs text-black/70">Top referrer count</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10">
            <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-emerald-600">{stats.verified.toLocaleString()}</div>
            <div className="text-xs text-black/70">Verified for rewards</div>
          </div>
        </div>
      </div>
    </section>
  );
}
