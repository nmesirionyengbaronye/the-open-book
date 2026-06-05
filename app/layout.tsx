import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppBubble } from '@/components/WhatsAppBubble';
import CursorTrail from '@/components/CursorTrail';
import { Toaster } from 'sonner';
import PageTransition from '@/components/PageTransition';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://waitlist.uniui.com.ng';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Uni UI \u2013 University Uploaded Intelligence | Your Semester, Uploaded',
    template: '%s | Uni UI',
  },
  description: 'Join the Uni UI waitlist. Upload your course materials, get AI-powered answers from your own notes, and ace your exams. Built by a FUTO student for Nigerian universities.',
  keywords: [
    'Uni UI', 'uploaded intelligence', 'FUTO', 'exam preparation', 'AI tutor',
    'Nigerian students', 'waitlist', 'semester notes', 'past questions', 'Pantero'
  ],
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'Uni UI \u2013 Your Semester, Uploaded',
    description: 'Join the waitlist. Real answers from your own course materials.',
    url: '/',
    siteName: 'Uni UI',
    images: [
      {
        url: '/favicon.jpg',
        width: 256,
        height: 256,
        alt: 'Uni UI \u2013 University Uploaded Intelligence',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Uni UI \u2013 Your Semester, Uploaded',
    description: 'Join the waitlist. Real answers from your own course materials.',
    images: ['/favicon.jpg'],
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
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'NGN',
    },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <CursorTrail />
        <Navbar />
        <main className="relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppBubble />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}