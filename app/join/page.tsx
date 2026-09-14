import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { APP_URL } from '@/lib/links';
import { JoinForm } from '@/components/JoinForm';

export const metadata: Metadata = {
  title: 'Uni UI Waitlist – University Uploaded Intelligence',
  description:
    'Built by Nigerian students, for Nigerian students. Uni UI is live at FUTO today. ' +
    'Join the waitlist to bring it to your university — early signups get priority access ' +
    'and free first-semester materials.',
  alternates: { canonical: 'https://waitlist.uniui.com.ng/join' },
  openGraph: {
    title: 'Uni UI Waitlist – University Uploaded Intelligence',
    description:
      'Built by Nigerian students, for Nigerian students. Live at FUTO now. Join the waitlist for your university.',
    url: 'https://waitlist.uniui.com.ng/join',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Uni UI waitlist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uni UI Waitlist – University Uploaded Intelligence',
    description: 'Built by Nigerian students, for Nigerian students. Live at FUTO now. Join the waitlist.',
    images: ['/og-image.svg'],
  },
};

export default function JoinPage() {
  return (
    <>
      <section className="py-10 px-5 text-center">
        <div className="max-w-3xl mx-auto inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <GraduationCap className="w-4 h-4" />
          <span>Uni UI is <span className="text-emerald-200 font-semibold">live at FUTO</span> right now.</span>
          <Link
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gold font-semibold hover:underline"
          >
            Use the app now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-white/30 mx-1">|</span>
          <span className="text-white/60">Expanding to more schools through August 2027</span>
        </div>
      </section>
      <JoinForm />
    </>
  );
}
