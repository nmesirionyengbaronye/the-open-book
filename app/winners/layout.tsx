import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reward Winners',
  description: 'See the students who have won Uni UI referral rewards and spin prizes.',
  // Genuinely public content, so this one stays indexed.
  alternates: { canonical: '/winners' },
};

export default function WinnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}