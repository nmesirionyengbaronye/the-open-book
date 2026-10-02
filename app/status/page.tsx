import { Metadata } from 'next';
import { Status } from '@/components/Status';

export const metadata: Metadata = {
  title: 'Rollout Status',
  description:
    'Live rollout status for Uni UI — which Nigerian universities have access and when the next wave lands.',
  keywords: [
    'Uni UI status', 'rollout status', 'which universities have Uni UI', 'launch schedule',
    'Southern Nigeria expansion', 'Uni UI November 2026',
  ],
  alternates: { canonical: '/status' },
};

export default function StatusPage() {
  return <Status />;
}