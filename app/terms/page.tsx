import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Terms of Service',
  description:
    'The terms governing use of the Uni UI website, waitlist, rewards and creator programme.',
  keywords: ['Uni UI terms', 'terms of service', 'Uni UI creator programme terms'],
  path: '/terms',
});

export default function TermsPage() {
  return (
      <div className="mx-auto max-w-3xl px-4 py-12 bg-[#FFD93D] text-black font-body antialiased">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Legal</span>
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-display font-bold uppercase tracking-tight leading-[0.95]">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-black/60">Last updated: August 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-black/80">
        <section>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">1. Acceptance of Terms</h2>
          <p>
            By joining the UniUI waitlist or participating in the rewards program, you agree to these terms.
            If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">2. Eligibility</h2>
          <p>
            You must be at least 13 years old to join. If you are under 18, you must have permission
            from a parent or guardian. You must provide accurate information during signup.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">3. Referral Program</h2>
          <p>
            Referral rewards are subject to verification. We reserve the right to disqualify accounts
            that engage in spam, fraud, or abuse of the referral system. Payouts are processed at our
            discretion and may take up to 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">4. Code of Conduct</h2>
          <p>
            Users must not create multiple accounts, use bots, or manipulate the referral system.
            Violations may result in disqualification and forfeiture of rewards.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">5. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">6. Contact</h2>
          <p>
            For questions about these terms, contact us through our official channels.
          </p>
        </section>
      </div>
    </div>
  );
}
