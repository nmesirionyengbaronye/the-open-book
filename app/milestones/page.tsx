import { Metadata } from 'next';
import { Milestones } from '@/components/Milestones';

export const metadata: Metadata = {
  title: 'Community Milestones',
  description: 'Track Uni UI collective progress, referral milestones and unlocked community rewards.',
  keywords: [
    'Uni UI milestones', 'community rewards', 'waitlist goals', 'referral milestones',
    'Uni UI community progress',
  ],
  alternates: { canonical: '/milestones' },
};

export default function MilestonesPage() {
  return <Milestones />;
}