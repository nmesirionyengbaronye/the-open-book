import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { WinnersClient } from './WinnersClient';

export const metadata: Metadata = pageMeta({
  title: 'Hall of Fame — Top Winners',
  description: 'Meet the Uni UI community members who have earned the most cash from the referral spin wheel.',
  keywords: [
    'Uni UI winners', 'referral earnings', 'spin wheel winners', 'student rewards Nigeria',
    'Uni UI hall of fame', 'cash prizes students',
  ],
  path: '/winners',
});

export default function WinnersPage() {
  return <WinnersClient />;
}