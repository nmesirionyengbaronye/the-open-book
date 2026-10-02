import { Metadata } from 'next';
import { Leaderboard } from '@/components/Leaderboard';

export const metadata: Metadata = {
  title: 'Top Referrers',
  description: 'See who has referred the most coursemates and climbed the Uni UI waitlist queue.',
  keywords: [
    'Uni UI leaderboard', 'top referrers', 'waitlist rankings', 'student referrals',
    'refer a friend', 'Uni UI referral leaderboard',
  ],
  alternates: { canonical: '/leaderboard' },
};

export default function LeaderboardPage() {
  return <Leaderboard />;
}
