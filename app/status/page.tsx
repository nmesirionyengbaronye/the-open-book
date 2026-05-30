import { Metadata } from 'next';
import { Status } from '@/components/Status';

export const metadata: Metadata = {
  title: 'Live Stats — Uni UI Waitlist',
  description: 'See how many students have joined the waitlist so far.',
};

export default function StatusPage() {
  return <Status />;
}