import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Rocket } from 'lucide-react';
import { APP_URL } from '@/lib/links';
import { JoinForm } from '@/components/JoinForm';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { pageMeta, webPageSchema, faqSchema, type Faq } from '@/lib/seo';

const DESCRIPTION =
  'Uni UI V2 is coming, and we are expanding across Southern Nigeria. Join the waitlist to ' +
  'get your university in the first wave — early signups get priority access and free ' +
  'first-semester course materials.';

const FAQS: Faq[] = [
  {
    question: 'What does the Uni UI waitlist actually give me?',
    answer:
      'Position in the queue for your university when Uni UI goes live there, priority access ' +
      'ahead of the general rollout, and free first-semester course materials. Joining is ' +
      'free and there is no obligation.',
  },
  {
    question: 'When does Uni UI reach my university?',
    answer:
      'The first wave of six Southern Nigerian universities goes live in November 2026, then ' +
      'three more universities are added every month until the entire Southern Nigeria ' +
      'lineup is covered by August 2027. Uni UI is already live at FUTO.',
  },
  {
    question: 'What is changing in V2?',
    answer:
      'V2 is the next version of Uni UI, built with creator feedback from the student ' +
      'community. It deepens the course-grounded learning context that already makes Uni UI ' +
      'different from general AI chatbots.',
  },
];

export const metadata: Metadata = pageMeta({
  title: 'Join the Waitlist – Uni UI V2 & Southern Nigeria Expansion',
  description: DESCRIPTION,
  keywords: [
    'Uni UI V2', 'Uni UI waitlist', 'Southern Nigeria universities', 'Uni UI expansion',
    'Nigerian university AI', 'FUTO', 'November 2026 launch', 'university waitlist',
    'course-grounded AI', 'free course materials', 'student AI platform',
  ],
  path: '/join',
  imageAlt: 'Join the Uni UI waitlist for V2 and the Southern Nigeria expansion',
});

export default function JoinPage() {
  return (
    <>
      <SeoJsonLd
        data={webPageSchema({
          name: 'Join the Uni UI Waitlist',
          description: DESCRIPTION,
          path: '/join',
          breadcrumb: [{ name: 'Join the Waitlist', path: '/join' }],
        })}
      />
      <SeoJsonLd data={faqSchema(FAQS)} />

      {/* Live-at-FUTO notice */}
      <section className="py-6 px-5 text-center">
        <div className="max-w-3xl mx-auto inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <GraduationCap className="w-4 h-4" />
          <span>
            Uni UI is <span className="text-emerald-200 font-semibold">live at FUTO</span> right now.
          </span>
          <Link
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gold font-semibold hover:underline"
          >
            Use the app now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-white/30 mx-1">|</span>
          <Link href="/creators" className="text-white/60 hover:text-gold transition-colors">
            Or apply to the Creator Programme
          </Link>
        </div>
      </section>

      {/* V2 + expansion positioning */}
      <section className="py-8 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-[0.2em]">
            <Rocket className="w-3.5 h-3.5" />
            V2 &middot; Southern Nigeria
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl font-display font-bold tracking-tight leading-tight">
            Uni UI V2 is coming — and it is coming to{' '}
            <span className="text-gold">every Southern Nigerian university.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-2xl mx-auto text-lg">
            Join the waitlist to get your university in the first wave. Early signups get
            priority access and free first-semester course materials.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              {
                label: 'First wave',
                value: 'November 2026',
                body: 'Six Southern Nigerian universities go live on app.uniui.com.ng.',
              },
              {
                label: 'After that',
                value: '3 per month',
                body: 'Three more universities are added every month after the first wave.',
              },
              {
                label: 'Full coverage',
                value: 'August 2027',
                body: 'The entire Southern Nigeria university lineup is covered by August 2027.',
              },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 border-gold/20">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-gold">{s.value}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visible FAQ — mirrors the FAQPage schema above */}
      <section className="py-10 px-5" aria-labelledby="join-faq">
        <div className="max-w-2xl mx-auto">
          <h2 id="join-faq" className="font-display text-2xl font-bold tracking-tight">
            Common questions
          </h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((f) => (
              <details key={f.question} className="glass rounded-xl p-4 border-gold/20">
                <summary className="cursor-pointer font-medium">{f.question}</summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <JoinForm />
    </>
  );
}