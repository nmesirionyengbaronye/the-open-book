import { Metadata } from 'next';
import { Retrieve } from '@/components/Retrieve';

export const metadata: Metadata = {
  title: 'Retrieve Your Referral Link',
  description: 'Lost your referral link? Enter your WhatsApp number to recover it.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/retrieve' },
};

export default function RetrievePage() {
  return <Retrieve />;
}