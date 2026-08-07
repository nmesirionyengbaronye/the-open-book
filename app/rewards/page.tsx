import Script from 'next/script';
import RewardsMiniApp from '@/components/rewards/RewardsMiniApp';

export const metadata = {
  title: 'UniUI Rewards',
  robots: { index: false, follow: false },
};

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
      />
      <RewardsMiniApp />
    </main>
  );
}
