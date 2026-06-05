import { Metadata } from 'next';
import { Milestones } from '@/components/Milestones';

export const metadata: Metadata = {
  title: 'Community Milestones \u2013 Uni UI',
  description: 'Track our collective progress and unlock new features.',
};

export default function MilestonesPage() {
  return <Milestones />;
}