import { Metadata } from 'next';
import { SUPPORT_EMAIL, TIKTOK_URL, X_URL } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Uni UI for support, partnerships, creator programme enquiries, or general questions.',
  keywords: [
    'contact Uni UI', 'Uni UI support', 'Uni UI partnerships',
    'creator programme contact', 'Uni UI help',
  ],
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Contact Us</h1>
      <p className="mt-2 text-sm text-white/60">We'd love to hear from you.</p>

      <div className="mt-8 space-y-6 text-sm text-white/80">
        <section>
          <h2 className="text-lg font-semibold text-white">One email address</h2>
          <p>
            Support, partnerships and general enquiries all reach the same inbox:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#D4AF37] hover:underline">
              sofia@uniui.com.ng
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Faster than email</h2>
          <p>
            For anything urgent — a wrong referral count, a creator payout question, or a claim
            that needs checking before you post — use the WhatsApp channel. Creator questions are
            fastest in the UNIUI Creators group.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Follow the build</h2>
          <p>
            Uni UI is on{' '}
            <a href={X_URL} target="_blank" rel="noreferrer" className="text-[#D4AF37] hover:underline">
              X
            </a>{' '}
            and{' '}
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="text-[#D4AF37] hover:underline">
              TikTok
            </a>{' '}
            as{' '}
            <span className="text-[#D4AF37]">@1stuniui_com_ng</span> for V2 progress and rollout
            announcements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Response time</h2>
          <p>We typically respond within 24–48 hours during business days.</p>
        </section>
      </div>
    </div>
  );
}
