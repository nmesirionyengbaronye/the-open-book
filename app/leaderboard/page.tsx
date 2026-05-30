import { Metadata } from 'next';
import { Leaderboard } from '@/components/Leaderboard';

export const metadata: Metadata = {
  title: 'Top Sharers — Uni UI Waitlist',
  description: 'See who is referring the most students on the waitlist.',
};

export default function LeaderboardPage() {
  return <Leaderboard />;
}