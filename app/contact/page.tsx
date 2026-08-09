import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | UniUI',
  description: 'Contact UniUI for support, partnerships, or general inquiries.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Contact Us</h1>
      <p className="mt-2 text-sm text-white/60">We'd love to hear from you.</p>

      <div className="mt-8 space-y-6 text-sm text-white/80">
        <section>
          <h2 className="text-lg font-semibold text-white">Support</h2>
          <p>For support inquiries, reach out via our WhatsApp channel or email.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Partnerships</h2>
          <p>Interested in partnering with UniUI? Contact us at <span className="text-[#D4AF37]">partnerships@uniuiapp.com</span></p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">General Inquiries</h2>
          <p>Email us at <span className="text-[#D4AF37]">hello@uniuiapp.com</span></p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Response Time</h2>
          <p>We typically respond within 24-48 hours during business days.</p>
        </section>
      </div>
    </div>
  );
}
