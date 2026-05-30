import { Metadata } from 'next';
import { JoinForm } from '@/components/JoinForm';

export const metadata: Metadata = {
  title: 'Join the Uni UI Waitlist',
  description: 'Secure your spot on the waitlist. Earlier signups = earlier access.',
};

export default function JoinPage() {
  return <JoinForm />;
}