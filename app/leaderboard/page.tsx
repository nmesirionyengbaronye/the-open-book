import { Metadata } from 'next';
import { Leaderboard } from '@/components/Leaderboard';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { pageMeta, webPageSchema, faqSchema, type Faq } from '@/lib/seo';

const FAQs: Faq[] = [
  {
    question: 'How are referral ranks determined?',
    answer:
      'Each time someone joins the waitlist through your referral link, your rank climbs. ' +
      'Verified referrals carry more weight than pending ones, and bonus referrals from campaigns ' +
      'also count toward your total.',
  },
  {
    question: 'Can I share my referral link more than once?',
    answer:
      'Yes. Your unique referral code (UNI-XXXXXX) can be shared anywhere — WhatsApp, TikTok, ' +
      'campus groups. Every successful signup through your link moves you up the leaderboard.',
  },
];

export const metadata: Metadata = pageMeta({
  title: 'Top Referrers',
  description: 'See who has referred the most coursemates and climbed the Uni UI waitlist queue.',
  keywords: [
    'Uni UI leaderboard', 'top referrers', 'waitlist rankings', 'student referrals',
    'refer a friend', 'Uni UI referral leaderboard',
  ],
  path: '/leaderboard',
});

export default function LeaderboardPage() {
  return (
    <>
      <SeoJsonLd
        data={webPageSchema({
          name: 'Top Referrers — Uni UI Leaderboard',
          description: 'See who has referred the most coursemates and climbed the Uni UI waitlist queue.',
          path: '/leaderboard',
          breadcrumb: [{ name: 'Leaderboard', path: '/leaderboard' }],
        })}
      />
      <SeoJsonLd data={faqSchema(FAQs)} />

      {/* Visible H1 + description rendered server-side so crawlers index the heading */}
      <section className="py-20 px-5" aria-labelledby="lb-hero">
        <div className="max-w-3xl mx-auto text-center">
          <h1 id="lb-hero" className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Top referrers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            These students are climbing the Uni UI waitlist queue fastest by bringing their coursemates along.
            Share your referral link to join them — every verified signup moves you up.
          </p>
        </div>
      </section>

      <Leaderboard />
    </>
  );
}
