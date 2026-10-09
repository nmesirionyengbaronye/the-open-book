import { Metadata } from 'next';
import { Leaderboard } from '@/components/Leaderboard';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Top Referrers',
  description: 'See who has referred the most coursemates and climbed the Uni UI waitlist queue.',
  keywords: [
    'Uni UI leaderboard', 'top referrers', 'waitlist rankings', 'student referrals',
    'refer a friend', 'Uni UI referral leaderboard',
  ],
  path: '/leaderboard',
});

export default function LeaderboardPage() {
  return <Leaderboard />;
}
