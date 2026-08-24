import { Metadata } from 'next';
import { Leaderboard } from '@/components/Leaderboard';

export const metadata: Metadata = {
  title: 'Top Referrers \u2013 Uni UI',
  description: 'See who has referred the most coursemates and climbed the waitlist queue.',
};

export default function LeaderboardPage() {
  return <Leaderboard />;
}
