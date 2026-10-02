import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ReferralLanding } from '@/components/ReferralLanding';

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: 'Join with a referral link',
    description: 'Join the Uni UI waitlist using a referral link.',
    // Referral landing pages are a near-infinite set of near-identical URLs —
    // one per code. They must never be indexed or they cannibalise /join and
    // dilute the whole domain. Follow is kept so link equity still passes.
    robots: { index: false, follow: true },
  };
}

export default async function ReferralRoute({ params }: PageProps) {
  const { code } = await params;
  if (!code || code.trim().length < 3) {
    redirect('/');
  }
  return <ReferralLanding code={code.trim()} />;
}
