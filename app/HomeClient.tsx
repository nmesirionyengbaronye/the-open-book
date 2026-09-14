'use client';

import { APP_URL } from '@/lib/links';
import { JoinForm } from '@/components/JoinForm';
import { Retrieve } from '@/components/Retrieve';
import { Leaderboard } from '@/components/Leaderboard';
import { Status } from '@/components/Status';
import { Milestones } from '@/components/Milestones';
import { ReferralTips } from '@/components/ReferralTips';
import { ReferralFAQ } from '@/components/ReferralFAQ';
import { ReferralContest } from '@/components/ReferralContest';
import { RecentActivity } from '@/components/RecentActivity';
import { SocialProof } from '@/components/SocialProof';
import { SchoolCounters } from '@/components/SchoolCounters';
import HeroSection from '@/components/HeroSection';
import Greeting from '@/components/Greeting';
import LaunchCountdown from '@/components/LaunchCountdown';
import { WhatIs, Features, HowItWorks, RolloutRoadmap, Testimonials, FAQ } from '@/components/Sections';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import useKonamiCode from '@/hooks/useKonamiCode';
import useSound from '@/hooks/useSound';

export default function HomeClient() {
  const { play } = useSound();
  const konamiUnlocked = useKonamiCode(() => play('unlock'));
  return (
    <>
      <section className="py-3 px-5 text-center">
        <div className="max-w-3xl mx-auto inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <GraduationCap className="w-4 h-4" />
          <span>Already at <span className="font-semibold">FUTO</span>?</span>
          <Link
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gold font-semibold hover:underline"
          >
            Use the app now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-white/30 mx-1">|</span>
          <span className="text-white/60">Live at FUTO · <span className="text-gold font-semibold">Expanding to more schools</span></span>
        </div>
      </section>
      <Greeting />
      <HeroSection />
      <LaunchCountdown />
      <section className="relative z-10 bg-[#0A0A0F]">
        <WhatIs />
        <Features />
        <HowItWorks />
        <RolloutRoadmap />
        <Testimonials />
        <FAQ />
        <SocialProof />
        <SchoolCounters />
        <ReferralTips />
        <ReferralContest />
        <ReferralFAQ />
        <RecentActivity />
        <JoinForm konamiUnlocked={konamiUnlocked} />
        <Retrieve />
        <Leaderboard />
        <Status />
        <Milestones />
      </section>
    </>
  );
}
