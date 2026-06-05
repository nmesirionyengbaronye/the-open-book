'use client';

import { WhatIs, Features, HowItWorks, Testimonials, FAQ, Recommendations } from '@/components/Sections';
import { JoinForm } from '@/components/JoinForm';
import { Retrieve } from '@/components/Retrieve';
import { Leaderboard } from '@/components/Leaderboard';
import { Status } from '@/components/Status';
import { Milestones } from '@/components/Milestones';
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
        <Testimonials />
        <FAQ />
        <Recommendations />
        <JoinForm konamiUnlocked={konamiUnlocked} />
        <Retrieve />
        <Leaderboard />
        <Status />
        <Milestones />
      </section>
    </>
  );
}