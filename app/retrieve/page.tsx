import { Metadata } from 'next';
import { Retrieve } from '@/components/Retrieve';

export const metadata: Metadata = {
  title: 'Retrieve Your Referral Link \u2013 Uni UI',
  description: 'Lost your referral link? Enter your WhatsApp number to recover it.',
};

export default function RetrievePage() {
  return <Retrieve />;
}