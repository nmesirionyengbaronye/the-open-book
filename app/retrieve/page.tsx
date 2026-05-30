import { Metadata } from 'next';
import { Retrieve } from '@/components/Retrieve';

export const metadata: Metadata = {
  title: 'Recover Referral Link — Uni UI',
  description: 'Recover your personal referral link if you already joined the waitlist.',
};

export default function RetrievePage() {
  return <Retrieve />;
}