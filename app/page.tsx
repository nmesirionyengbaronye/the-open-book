'use client';

import { WhatIs, Features, HowItWorks, RolloutRoadmap, Testimonials, FAQ } from '@/components/Sections';
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
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uni UI – University Uploaded Intelligence',
  description:
    'Built by Nigerian students, for Nigerian students. Uni UI is live at FUTO today and expanding to Southern-Nigeria universities through August 2027. Join the waitlist with your WhatsApp number.',
  alternates: { canonical: 'https://waitlist.uniui.com.ng/' },
  openGraph: {
    title: 'Uni UI – University Uploaded Intelligence',
    description:
      'Built by Nigerian students, for Nigerian students. Live at FUTO now. Join the waitlist to bring Uni UI to your university.',
    url: 'https://waitlist.uniui.com.ng/',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Uni UI – University Uploaded Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uni UI – University Uploaded Intelligence',
    description: 'Built by Nigerian students, for Nigerian students. Live at FUTO now.',
    images: ['/og-image.svg'],
  },
};

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