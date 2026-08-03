import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ReferralLanding } from '@/components/ReferralLanding';

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Join with ${code} – Uni UI`,
    description: 'Join the Uni UI waitlist using a referral link.',
  };
}

export default async function ReferralRoute({ params }: PageProps) {
  const { code } = await params;
  if (!code || code.trim().length < 3) {
    redirect('/');
  }
  return <ReferralLanding code={code.trim()} />;
}
