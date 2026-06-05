import { Metadata } from 'next';
import { Status } from '@/components/Status';

export const metadata: Metadata = {
  title: 'Live Waitlist Status \u2013 Uni UI',
  description: 'Real-time signup numbers, recent joiners, and growth charts.',
};

export default function StatusPage() {
  return <Status />;
}