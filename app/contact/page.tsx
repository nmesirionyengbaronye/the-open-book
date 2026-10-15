import { Metadata } from 'next';
import { SUPPORT_EMAIL, TIKTOK_URL, X_URL, INSTAGRAM_URL } from '@/lib/links';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Contact Uni UI',
  description:
    'Contact Uni UI for support, partnerships, creator programme enquiries, or general questions.',
  keywords: [
    'contact Uni UI', 'Uni UI support', 'Uni UI partnerships',
    'creator programme contact', 'Uni UI help',
  ],
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 bg-[#FFD93D] text-black font-body antialiased">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Contact</span>
      </div>
      <h1 className="mt-6 text-4xl sm:text-5xl font-display font-bold uppercase tracking-tight leading-[0.95]">
        ONE INBOX.<br className="hidden sm:block" /> REAL ANSWERS.
      </h1>
      <p className="mt-4 text-base sm:text-lg text-black/70 max-w-2xl leading-relaxed">
        We'd love to hear from you.
      </p>

      <div className="mt-10 space-y-6">
        <section className="rounded-2xl border border-black/10 bg-black/5 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">One email address</h2>
          <p className="mt-2 text-sm leading-relaxed text-black/75">
            Support, partnerships and general enquiries all reach the same inbox:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-black underline underline-offset-2 font-semibold">
              sofia@uniui.com.ng
            </a>
          </p>
        </section>

        <section className="rounded-2xl border border-black/10 bg-black/5 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">Faster than email</h2>
          <p className="mt-2 text-sm leading-relaxed text-black/75">
            For anything urgent — a wrong referral count, a creator payout question, or a claim
            that needs checking before you post — use the WhatsApp channel. Creator questions are
            fastest in the UNIUI Creators group.
          </p>
        </section>

        <section className="rounded-2xl border border-black/10 bg-black/5 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">Follow the build</h2>
          <p className="mt-2 text-sm leading-relaxed text-black/75">
            Uni UI is on{' '}
            <a href={X_URL} target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-2 font-semibold">
              X
            </a>,{' '}
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-2 font-semibold">
              TikTok
            </a>, and{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-2 font-semibold">
              Instagram
            </a>{' '}
            for V2 progress and rollout announcements.
          </p>
        </section>

        <section className="rounded-2xl border border-black/10 bg-black/5 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">Response time</h2>
          <p className="mt-2 text-sm leading-relaxed text-black/75">We typically respond within 24–48 hours during business days.</p>
        </section>
      </div>
    </div>
  );
}
