import { Metadata } from 'next';
import Link from 'next/link';
import { Eye, CreditCard, Bell, ShieldAlert, LayoutDashboard, Share2 } from 'lucide-react';
import { FamilyWaitlistForm } from '@/components/FamilyWaitlistForm';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { pageMeta, webPageSchema, faqSchema, type Faq } from '@/lib/seo';

const DESCRIPTION =
  'Stay connected to your child&apos;s education with Uni UI family accounts. Real progress ' +
  'visibility, direct school fee payments, emergency updates, and a private family dashboard ' +
  'for all your children. Join the family waitlist — built for Nigerian parents.';

const FAQS: Faq[] = [
  {
    question: 'Is my child&apos;s data secure?',
    answer:
      'Yes. All family data is private and end-to-end encrypted. We never share progress data ' +
      'without your child&apos;s explicit consent, and every family dashboard is password-protected ' +
      'with optional two-factor authentication.',
  },
  {
    question: 'How much does a family account cost?',
    answer:
      'Family plans start at ₦5,000/month for 2 children. Each additional child adds a small surcharge. ' +
      'You are never charged while on the waitlist — payment details are collected only when your account ' +
      'is activated at launch.',
  },
  {
    question: 'Do I need my child to be on Uni UI already?',
    answer:
      'No. You can join the family waitlist at any time. If your child is already on Uni UI we will ' +
      'connect your accounts (with their consent); if not, they will be invited when Uni UI reaches their school.',
  },
  {
    question: 'Can I pay fees for multiple children?',
    answer:
      'Yes. The family dashboard supports paying school fees and subscriptions for all linked children ' +
      'in a single checkout, with receipts saved automatically.',
  },
];

const WHAT_PARENTS_GET = [
  {
    Icon: Eye,
    title: 'Real progress, not grades',
    body: 'See study hours, engagement, streaks. Understand where your child is improving.',
  },
  {
    Icon: CreditCard,
    title: 'Pay school fees & subscriptions',
    body: 'Directly through Uni UI with receipts. No more bank transfers through WhatsApp.',
  },
  {
    Icon: Bell,
    title: 'Important updates',
    body: 'Fee deadlines, exam dates, results — from your child&apos;s institution, in real time.',
  },
  {
    Icon: ShieldAlert,
    title: 'Emergency contact',
    body: 'Be there when it matters most, with your child&apos;s consent.',
  },
  {
    Icon: LayoutDashboard,
    title: 'Family dashboard',
    body: 'All children in one place. Simple, private, yours.',
  },
];

export const metadata: Metadata = pageMeta({
  title: 'Family Waitlist – Track Your Child\'s Progress | Uni UI',
  description: DESCRIPTION,
  keywords: [
    'parent waitlist Nigeria', 'student progress tracking', 'school fee payment',
    'Uni UI family account', 'parent dashboard', 'Nigerian parents',
    'student engagement', 'fee payment platform',
  ],
  path: '/families',
  imageAlt: 'Uni UI family dashboard — parents track their child\'s academic progress',
});

export default function FamiliesPage() {
  return (
    <>
      <SeoJsonLd
        data={webPageSchema({
          name: 'Family Waitlist – Uni UI',
          description: DESCRIPTION,
          path: '/families',
          breadcrumb: [{ name: 'Family Waitlist', path: '/families' }],
        })}
      />
      <SeoJsonLd data={faqSchema(FAQS)} />

      {/* Pitch */}
      <section className="py-24 px-5" aria-labelledby="fam-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-[0.2em]">
            <ShieldAlert className="w-3.5 h-3.5" />
            For Parents &amp; Guardians
          </div>
          <h1 id="fam-hero" className="mt-5 text-4xl sm:text-6xl font-display font-bold tracking-tight leading-tight">
            Stay <span className="text-gold">connected</span> to your child&apos;s education.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Uni UI family accounts give parents real visibility into study progress, a simple way
            to pay school fees and subscriptions, and instant updates from your child&apos;s
            institution. Join the waitlist — built for Nigerian families.
          </p>
        </div>
      </section>

      {/* What parents get */}
      <section className="px-5 py-14" aria-labelledby="fam-whats">
        <div className="max-w-5xl mx-auto">
          <h2 id="fam-whats" className="font-display text-3xl font-bold tracking-tight text-center">
            What Uni UI gives you
          </h2>
          <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
            One dashboard, all your children. No guesswork — just clarity.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_PARENTS_GET.map(({ Icon, title, body }) => (
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

      <FamilyWaitlistForm />

      {/* Cross-path discovery */}
      <section className="py-12 px-5 border-t border-black/5">
        <div className="max-w-2xl mx-auto text-center space-y-3 text-sm text-muted-foreground">
          <p>
            Is your child joining?{' '}
            <Link href="/join" className="text-gold underline">Send them the student waitlist →</Link>
          </p>
          <p>
            A creator? <Link href="/creators" className="text-gold underline">Apply to the Creator Program →</Link>
          </p>
          <p>
            Represent an institution? <Link href="/institutions" className="text-gold underline">Request recognition →</Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-5" aria-labelledby="fam-faq">
        <div className="max-w-3xl mx-auto">
          <h2 id="fam-faq" className="font-display text-3xl font-bold tracking-tight">
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
