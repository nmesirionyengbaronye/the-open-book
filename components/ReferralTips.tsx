'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, Trophy, Gift, Flame, Target, Zap, Crown, Award, Sparkles } from 'lucide-react';
import { TIERS, GIVEAWAY_ENTRY_THRESHOLD } from '@/lib/tiers';

const EARLY_ACCESS = TIERS.find((t) => t.type === 'early_access');
const LIFETIME = TIERS.find((t) => t.type === 'lifetime_access');

const TIPS = [
  {
    icon: Share2,
    title: 'Share your link',
    body: 'Your referral link is your superpower. Share it on WhatsApp, Twitter, LinkedIn, and Instagram.',
  },
  {
    icon: Users,
    title: 'Invite coursemates',
    body: 'Your classmates trust you. A personal invite converts 3x better than a generic post.',
  },
  {
    icon: Trophy,
    title: 'Climb the leaderboard',
    body: 'Every referral moves you up. Top 10 referrers get exclusive early access and badges.',
  },
  {
    icon: Gift,
    title: 'Unlock rewards',
    body: `Hit ${GIVEAWAY_ENTRY_THRESHOLD} verified referrals to unlock your first spin (then 1 spin per ${GIVEAWAY_ENTRY_THRESHOLD} verified referrals, unlimited). ${EARLY_ACCESS?.threshold} verified referrals gets early access. ${LIFETIME?.threshold} verified referrals gets lifetime access.`,
  },
  {
    icon: Flame,
    title: 'Build a streak',
    body: 'Refer at least one person every day to maintain your streak and earn bonus visibility.',
  },
  {
    icon: Target,
    title: 'Set a daily goal',
    body: 'Aim for 3-5 referrals daily. Small consistent efforts beat one viral post.',
  },
];

export function ReferralTips() {
  return (
    <section className="py-20 px-5 bg-[#FFD93D]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-black/80 uppercase">Growth Playbook</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold text-black">
            How to <span className="text-black">go viral</span> on Uni UI
          </h2>
          <p className="mt-3 text-black/70 max-w-xl mx-auto">
            Six proven tactics to maximize your referrals and unlock rewards faster.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIPS.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] border border-black/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFD93D] grid place-items-center">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="mt-5 text-xl font-display font-semibold text-black">{tip.title}</h3>
                <p className="mt-2 text-black/70 text-sm leading-relaxed">{tip.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
