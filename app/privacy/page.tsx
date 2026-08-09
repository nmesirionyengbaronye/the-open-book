import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | UniUI',
  description: 'Privacy policy for UniUI waitlist and rewards program.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-white/60">Last updated: August 2026</p>

      <div className="prose prose-invert mt-8 space-y-6 text-sm text-white/80">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
          <p>
            We collect your WhatsApp number, name, and optional profile information when you join the waitlist.
            We also collect usage data such as referral activity and engagement metrics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. How We Use Your Information</h2>
          <p>
            We use your information to manage the waitlist, track referrals, award rewards, and communicate
            important updates. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Data Sharing</h2>
          <p>
            We may share anonymized aggregate data for analytics purposes. Your personal information is never
            sold or shared with marketing partners.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Data Retention</h2>
          <p>
            We retain your data for the duration of the waitlist program. You may request deletion of your data
            at any time using the data deletion request form.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Security</h2>
          <p>
            We implement industry-standard security measures to protect your data, including encryption,
            access controls, and regular security audits.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data. You may opt out of
            communications at any time. Contact us to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Contact</h2>
          <p>
            For privacy inquiries or data deletion requests, please use our contact form or reach out
            through our official channels.
          </p>
        </section>
      </div>
    </div>
  );
}
