import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppBubble } from '@/components/WhatsAppBubble';
import { Toaster } from 'sonner';
import PageTransition from '@/components/PageTransition';
import './globals.css';

export const metadata: Metadata = {
  title: 'Uni UI — Your Semester, Uploaded.',
  description: 'Upload your course materials. Get accurate answers sourced from your own notes. Built by a FUTO student for students across West Africa.',
  keywords: ['Uni UI', 'waitlist', 'AI study assistant', 'Nigeria', 'university', 'FUTO', 'UNILAG', 'education'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Uni UI — Your Semester, Uploaded.',
    description: 'Upload your course materials. Get accurate answers sourced from your own notes.',
    type: 'website',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uni UI — Your Semester, Uploaded.',
    description: 'Upload your course materials. Get accurate answers sourced from your own notes.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
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