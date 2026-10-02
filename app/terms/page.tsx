import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms governing use of the Uni UI website, waitlist, rewards and creator programme.',
  keywords: ['Uni UI terms', 'terms of service', 'Uni UI creator programme terms'],
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-white/60">Last updated: August 2026</p>

      <div className="prose prose-invert mt-8 space-y-6 text-sm text-white/80">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By joining the UniUI waitlist or participating in the rewards program, you agree to these terms.
            If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Eligibility</h2>
          <p>
            You must be at least 13 years old to join. If you are under 18, you must have permission
            from a parent or guardian. You must provide accurate information during signup.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Referral Program</h2>
          <p>
            Referral rewards are subject to verification. We reserve the right to disqualify accounts
            that engage in spam, fraud, or abuse of the referral system. Payouts are processed at our
            discretion and may take up to 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Code of Conduct</h2>
          <p>
            Users must not create multiple accounts, use bots, or manipulate the referral system.
            Violations may result in disqualification and forfeiture of rewards.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Contact</h2>
          <p>
            For questions about these terms, contact us through our official channels.
          </p>
        </section>
      </div>
    </div>
  );
}
