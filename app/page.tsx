'use client';

import { WhatIs, Features, HowItWorks, Testimonials, FAQ } from '@/components/Sections';
import { JoinForm } from '@/components/JoinForm';
import { Retrieve } from '@/components/Retrieve';
import { Leaderboard } from '@/components/Leaderboard';
import { Status } from '@/components/Status';
import { Milestones } from '@/components/Milestones';
import HeroSection from '@/components/HeroSection';
import Greeting from '@/components/Greeting';
import GreetingBanner from '@/components/GreetingBanner';
import LaunchCountdown from '@/components/LaunchCountdown';
import useKonamiCode from '@/hooks/useKonamiCode';

export default function Home() {
  const konamiUnlocked = useKonamiCode();
  return (
    <>
      <GreetingBanner />
      <Greeting />
      <HeroSection />
      <LaunchCountdown />
      <section className="relative z-10 bg-[#0A0A0F]">
        <WhatIs />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <JoinForm konamiUnlocked={konamiUnlocked} />
        <Retrieve />
        <Leaderboard />
        <Status />
        <Milestones />
      </section>
    </>
  );
}