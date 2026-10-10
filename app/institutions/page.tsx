import { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, BookOpen, Users, MessageSquare, Shield } from 'lucide-react';
import { InstitutionWaitlistForm } from '@/components/InstitutionWaitlistForm';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { pageMeta, webPageSchema, faqSchema, type Faq } from '@/lib/seo';

const DESCRIPTION =
  'Bring Uni UI to your university, polytechnic, or college of education. ' +
  'Get real-time student analytics, course-level insights, engagement metrics, and ' +
  'NDPA-compliant communication tools — built for Nigerian institutions. Request early access.';

const FAQS: Faq[] = [
  {
    question: 'What data do you collect about students?',
    answer:
      'Only aggregated, anonymised engagement data that individual institutions already ' +
      'collect. No personal student information is shared without explicit consent, and ' +
      'every query result is anonymised across a minimum of 100 students per result.',
  },
  {
    question: 'Do we have to pay to be on the waitlist?',
    answer:
      'No. Joining the institution waitlist is free and carries no obligation. We review ' +
      'requests weekly and share onboarding details via your institutional email.',
  },
  {
    question: 'My institution is not in Nigeria — can I still sign up?',
    answer:
      'This rollout targets Nigerian universities, polytechnics, and colleges of education. ' +
      'If you represent an institution elsewhere that would benefit from student learning ' +
      'analytics, reach out at sofia@uniui.com.ng.',
  },
  {
    question: 'What happens after I submit?',
    answer:
      'You are placed in the institution queue and receive your position immediately. ' +
      'The Uni UI team reviews institutional requests weekly and follows up on your ' +
      'official email to arrange onboarding.',
  },
];

const WHAT_WE_PROVIDE = [
  {
    Icon: BarChart3,
    title: 'Real-time student analytics',
    body: 'Which courses students struggle with. When engagement drops. What resources actually help — across every department.',
  },
  {
    Icon: BookOpen,
    title: 'Course-level insights',
    body: 'Topic mastery heatmaps. Common misconceptions. Comparative benchmarks against peer institutions.',
  },
  {
    Icon: Users,
    title: 'Engagement metrics',
    body: 'Which students are active, when, and for how long. Early warning on retention risk.',
  },
  {
    Icon: MessageSquare,
    title: 'Communication tools',
    body: 'Announcements, events, and department coordination — all built for academic use.',
  },
  {
    Icon: Shield,
    title: 'NDPA compliant',
    body: 'Explicit consent, anonymised aggregation, minimum 100 students per query result.',
  },
];

export const metadata: Metadata = pageMeta({
  title: 'Institution Waitlist – Uni UI Analytics for Universities & Polytechnics',
  description: DESCRIPTION,
  keywords: [
    'institution waitlist', 'university analytics Nigeria', 'polytechnic student data',
    'educational analytics', 'Nigerian universities', 'course learning analytics',
    'Uni UI for institutions', 'institutional early access', 'edu.ng',
  ],
  path: '/institutions',
  imageAlt: 'Uni UI institution analytics — real-time student learning insights',
});

export default function InstitutionsPage() {
  return (
    <>
      <SeoJsonLd
        data={webPageSchema({
          name: 'Institution Waitlist – Uni UI',
          description: DESCRIPTION,
          path: '/institutions',
          breadcrumb: [{ name: 'Institution Waitlist', path: '/institutions' }],
        })}
      />
      <SeoJsonLd data={faqSchema(FAQS)} />

      {/* Pitch */}
      <section className="py-24 px-5" aria-labelledby="inst-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-[0.2em]">
            <Shield className="w-3.5 h-3.5" />
            For Universities &amp; Polytechnics
          </div>
          <h1 id="inst-hero" className="mt-5 text-4xl sm:text-6xl font-display font-bold tracking-tight leading-tight">
            Understand how your <span className="text-gold">students actually learn.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Uni UI gives Nigerian institutions real-time, anonymised analytics on student
            engagement, topic mastery, and retention risk — plus communication tools built
            for academic use. Request recognition and early access below.
          </p>
        </div>
      </section>

      {/* What institutions get */}
      <section className="px-5 py-14" aria-labelledby="inst-whats">
        <div className="max-w-5xl mx-auto">
          <h2 id="inst-whats" className="font-display text-3xl font-bold tracking-tight text-center">
            What we&apos;ll provide
          </h2>
          <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
            No credit card, no commitment. Just insights that help your institution teach better.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_WE_PROVIDE.map(({ Icon, title, body }) => (
              <div key={title} className="glass rounded-2xl p-6 border-gold/20">
                <div className="w-10 h-10 rounded-xl bg-gold/15 grid place-items-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InstitutionWaitlistForm />

      {/* Cross-path discovery */}
      <section className="py-12 px-5 border-t border-black/5">
        <div className="max-w-2xl mx-auto text-center space-y-3 text-sm text-muted-foreground">
          <p>
            Not representing an institution?{' '}
            <Link href="/join" className="text-gold underline">Join as a student →</Link>
          </p>
          <p>
            A creator? <Link href="/creators" className="text-gold underline">Apply to the Creator Program →</Link>
          </p>
          <p>
            A parent or guardian? <Link href="/families" className="text-gold underline">Join the family waitlist →</Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-5" aria-labelledby="inst-faq">
        <div className="max-w-3xl mx-auto">
          <h2 id="inst-faq" className="font-display text-3xl font-bold tracking-tight">
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
    </>
  );
}
