'use client';

import { WhatIs, Features, HowItWorks, RolloutRoadmap, Testimonials, FAQ, Recommendations } from '@/components/Sections';
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
import HeroSection from '@/components/HeroSection';
import Greeting from '@/components/Greeting';
import LaunchCountdown from '@/components/LaunchCountdown';
import useKonamiCode from '@/hooks/useKonamiCode';
import useSound from '@/hooks/useSound';

export default function Home() {
  const { play } = useSound();
  const konamiUnlocked = useKonamiCode(() => play('unlock'));
  return (
    <>
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
        <Recommendations />
        <SocialProof />
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