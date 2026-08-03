import { Metadata } from 'next';
import { ReferralDashboard } from '@/components/ReferralDashboard';

export const metadata: Metadata = {
  title: 'Referral Dashboard – Uni UI',
  description: 'Track your referrals, badges, queue position, and share your link.',
};

export default function ReferralDashboardPage() {
  return <ReferralDashboard />;
}
