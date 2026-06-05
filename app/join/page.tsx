import { Metadata } from 'next';
import { JoinForm } from '@/components/JoinForm';

export const metadata: Metadata = {
  title: 'Join the Waitlist \u2013 Uni UI',
  description: 'Sign up with your WhatsApp number, get a referral link, and move up the queue.',
};

export default function JoinPage() {
  return <JoinForm />;
}