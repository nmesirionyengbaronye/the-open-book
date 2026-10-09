import { Metadata } from 'next';
import { Milestones } from '@/components/Milestones';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Community Milestones',
  description: 'Track Uni UI collective progress, referral milestones and unlocked community rewards.',
  keywords: [
    'Uni UI milestones', 'community rewards', 'waitlist goals', 'referral milestones',
    'Uni UI community progress',
  ],
  path: '/milestones',
});

export default function MilestonesPage() {
  return <Milestones />;
}