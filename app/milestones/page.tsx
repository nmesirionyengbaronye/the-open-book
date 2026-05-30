import { Metadata } from 'next';
import { Milestones } from '@/components/Milestones';

export const metadata: Metadata = {
  title: 'Milestones — Uni UI Roadmap',
  description: 'See what features unlock at each waitlist milestone.',
};

export default function MilestonesPage() {
  return <Milestones />;
}