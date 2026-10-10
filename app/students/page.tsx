import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Rocket, ArrowRight } from 'lucide-react';
import { JoinForm } from '@/components/JoinForm';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { pageMeta, webPageSchema, faqSchema, type Faq } from '@/lib/seo';
import { APP_URL } from '@/lib/links';

const DESCRIPTION =
  'Join the Uni UI student waitlist. Get priority access to course materials, ' +
  'AI-powered study tools grounded in your own notes, and entry into the referral ' +
  'queue at your university. First wave of Southern Nigerian universities lands November 2026.';

const FAQS: Faq[] = [
  {
    question: 'What does the Uni UI waitlist give me?',
    answer:
      'Position in the queue for your university, priority access ahead of the general rollout, ' +
      'and free first-semester course materials. Joining is free and there is no obligation.',
  },
  {
    question: 'When does Uni UI reach my university?',
    answer:
      'The first wave of six Southern Nigerian universities goes live in November 2026, then three ' +
      'more universities are added every month through August 2027. Uni UI is already live at FUTO.',
  },
  {
    question: 'Do I need a WhatsApp number?',
    answer:
      'Yes — we invite students in queue order via WhatsApp when access for your school opens. ' +
      'Your number is only used for waitlist notifications and referral verification.',
  },
];

export const metadata: Metadata = pageMeta({
  title: 'Student Waitlist – Uni UI V2 | Get Priority Access',
  description: DESCRIPTION,
  keywords: [
    'student waitlist Nigeria', 'Uni UI student access', 'university AI study tool',
    'Nigerian student', 'upload lecture notes', 'exam preparation', 'referral waitlist',
  ],
  path: '/students',
  imageAlt: 'Uni UI student waitlist — join for priority access to course materials',
});

export default function StudentsPage() {
  return (
    <>
      <SeoJsonLd
        data={webPageSchema({
          name: 'Student Waitlist – Uni UI',
          description: DESCRIPTION,
          path: '/students',
          breadcrumb: [{ name: 'Student Waitlist', path: '/students' }],
        })}
      />
      <SeoJsonLd data={faqSchema(FAQS)} />

      {/* Pitch */}
      <section className="py-16 px-5" aria-labelledby="student-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-[0.2em]">
            <GraduationCap className="w-3.5 h-3.5" />
            For Students
          </div>
          <h1 id="student-hero" className="mt-5 text-4xl sm:text-6xl font-display font-bold tracking-tight leading-tight">
            Your <span className="text-gold">semester, uploaded</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the Uni UI waitlist for priority access to AI-powered study tools grounded in your
            own course materials. Earlier signups get earlier access and free first-semester materials.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover"
            >
              Use Uni UI now (FUTO) <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="self-center text-sm text-muted-foreground">or join the waitlist below</span>
          </div>
        </div>
      </section>

      {/* Live-at-FUTO + V2 positioning (mirrors /join hero) */}
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
          <span className="text-white/30 mx-1">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-gold" />
            V2 &amp; Southern Nigeria
          </span>
        </div>
      </section>

      <JoinForm />

      {/* FAQ */}
      <section className="py-14 px-5" aria-labelledby="student-faq">
        <div className="max-w-3xl mx-auto">
          <h2 id="student-faq" className="font-display text-3xl font-bold tracking-tight">
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

      {/* Cross-path discovery */}
      <section className="py-12 px-5 border-t border-black/5">
        <div className="max-w-2xl mx-auto text-center space-y-3 text-sm text-muted-foreground">
          <p>
            A parent or guardian?{' '}
            <Link href="/families" className="text-gold underline">Join the family waitlist →</Link>
          </p>
          <p>
            Represent an institution?{' '}
            <Link href="/institutions" className="text-gold underline">Request recognition →</Link>
          </p>
          <p>
            A creator? <Link href="/creators" className="text-gold underline">Apply to the Creator Program →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
