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
import { WaitlistPaths } from '@/components/WaitlistPaths';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import useKonamiCode from '@/hooks/useKonamiCode';
import useSound from '@/hooks/useSound';

export default function HomeClient() {
  const { play } = useSound();
  const konamiUnlocked = useKonamiCode(() => play('unlock'));
  return (
    <>
      <Greeting />
      <HeroSection />
      <LaunchCountdown />
      <WaitlistPaths />
      <section className="relative z-10 bg-[#FFD93D] text-black">
        <WhatIs />
        <Features />
        <HowItWorks />
        <RolloutRoadmap />
        <Testimonials />
        <FAQ />
        <SocialProof />
        <SchoolCounters />
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
