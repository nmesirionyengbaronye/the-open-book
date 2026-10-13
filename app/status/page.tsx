import { Metadata } from 'next';
import { Status } from '@/components/Status';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { pageMeta, webPageSchema, faqSchema, type Faq } from '@/lib/seo';

const FAQs: Faq[] = [
  {
    question: 'How often is the rollout status updated?',
    answer:
      'The status page reflects the latest confirmed wave dates from the Uni UI team. Dates shift when a ' +
      'wave is delayed, so check back after each announcement.',
  },
  {
    question: 'How do I know when Uni UI reaches my university?',
    answer:
      'We notify every student on the waitlist by WhatsApp when access for their school opens. ' +
      'You can also track your position on the status page.',
  },
];

export const metadata: Metadata = pageMeta({
  title: 'Rollout Status',
  description:
    'Live rollout status for Uni UI — which Nigerian universities have access and when the next wave lands.',
  keywords: [
    'Uni UI status', 'rollout status', 'which universities have Uni UI', 'launch schedule',
    'Southern Nigeria expansion', 'Uni UI November 2026',
  ],
  path: '/status',
});

export default function StatusPage() {
  return (
    <>
      <SeoJsonLd
        data={webPageSchema({
          name: 'Rollout Status',
          description:
            'Live rollout status for Uni UI — which Nigerian universities have access and when the next wave lands.',
          path: '/status',
          breadcrumb: [{ name: 'Rollout Status', path: '/status' }],
        })}
      />
      <SeoJsonLd data={faqSchema(FAQs)} />

      {/* Visible H1 + description rendered server-side so crawlers index the heading */}
      <section className="py-20 px-5" aria-labelledby="status-hero">
        <div className="max-w-3xl mx-auto text-center">
          <h1 id="status-hero" className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Uni UI rollout status
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Track which Nigerian universities have access to Uni UI today, which schools open next,
            and when your campus gets its turn. We notify every waitlisted student by WhatsApp when
            access opens for their institution.
          </p>
        </div>
      </section>

      <Status />
    </>
  );
}