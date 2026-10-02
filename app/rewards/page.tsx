import RewardsMiniApp from '@/components/rewards/RewardsMiniApp';

export const metadata = {
  title: 'Uni UI Rewards',
  // An interactive mini-app behind a login, not a content page.
  robots: { index: false, follow: false },
  alternates: { canonical: '/rewards' },
};

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <RewardsMiniApp />
    </main>
  );
}
