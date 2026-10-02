import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import Footer02 from '@/components/Footer02';
import { WhatsAppBubble } from '@/components/WhatsAppBubble';
import CursorTrail from '@/components/CursorTrail';
import { Toaster } from 'sonner';
import PageTransition from '@/components/PageTransition';
import './globals.css';
import { jsonLdScript } from '@/lib/seo';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://waitlist.uniui.com.ng';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Uni UI V2 – Your Semester, Uploaded | Join the Waitlist',
    template: '%s | Uni UI',
  },
  description:
    'Uni UI V2 is coming, and it is coming to every Southern Nigerian university. Join the waitlist to get your campus in the first wave — early signups get priority access and free first-semester materials.',
  keywords: [
    'Uni UI', 'Uni UI V2', 'uploaded intelligence', 'FUTO', 'exam preparation', 'AI tutor',
    'Nigerian students', 'waitlist', 'semester notes', 'past questions', 'Pantero',
    'Southern Nigeria universities', 'course-grounded AI', 'university expansion',
  ],
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'Uni UI V2 – Your Semester, Uploaded',
    description:
      'V2 is coming, and it is coming to every Southern Nigerian university. Join the waitlist to get your campus in the first wave. Live at FUTO now.',
    url: '/',
    siteName: 'Uni UI',
    images: [
      {
        url: '/og-image.png',
        width: 640,
        height: 360,
        alt: 'Uni UI – University Uploaded Intelligence',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uni UI V2 – Your Semester, Uploaded',
    description:
      'V2 is coming to every Southern Nigerian university. Join the waitlist to get your campus in the first wave.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Uni UI',
    url: baseUrl,
    logo: `${baseUrl}/favicon.jpg`,
    description: 'AI-powered semester exam preparation for Nigerian university students.',
    founder: {
      '@type': 'Person',
      name: 'FUTO Student Founder',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Uni UI',
    url: baseUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    description: 'Upload your course materials and get accurate, source-cited answers to exam questions.',
    // Real prices. A `price: '0'` Offer here would be a factual error that
    // contradicts the pricing on /join, and search engines surface offers.
    offers: [
      {
        '@type': 'Offer',
        name: 'Scholar',
        description: 'Subscription plan. Earns creator commission on first payment and six recurring months.',
        price: '2500',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/PreOrder',
        url: `${baseUrl}/join`,
      },
      {
        '@type': 'Offer',
        name: 'Deep Study',
        description: 'One-time purchase. No recurring commission.',
        price: '10000',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/PreOrder',
        url: `${baseUrl}/join`,
      },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG" className="dark">
      <head>
        <script
          type="application/ld+json"
          // Escapes "<" so the payload cannot terminate the script tag early.
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
        {/* Telegram Mini App bridge. Required so window.Telegram.WebApp exists
            when the Rewards Mini App is opened inside Telegram. Loaded as a plain
            blocking <script> in <head> (NOT next/script / beforeInteractive): the
            Telegram SDK must run as a normal synchronous script so window.Telegram
            is present before the page's own JS executes. next/script's
            beforeInteractive is injected by the Next runtime and does not reliably
            run first inside the Mini App WebView, leaving window.Telegram undefined. */}
        <script src="https://telegram.org/js/telegram-web-app.js" async={false} />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <CursorTrail />
        <Navbar />
        <main className="relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer02 />
        <WhatsAppBubble />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}