import { Metadata } from 'next';
import { ReferralDashboard } from '@/components/ReferralDashboard';

export const metadata: Metadata = {
  title: 'Referral Dashboard',
  description: 'Track your referrals, badges, queue position, and share your link.',
  // Personal, per-user data. Nothing here is useful in a search result and
  // indexing it exposes referral codes in SERP snippets.
  robots: { index: false, follow: true },
  alternates: { canonical: '/dashboard' },
};

export default function ReferralDashboardPage() {
  return <ReferralDashboard />;
}
