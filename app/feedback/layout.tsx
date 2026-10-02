import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share Feedback',
  description: 'Tell the Uni UI team what to build next.',
  // A form, not content. There is nothing here for a searcher.
  robots: { index: false, follow: true },
  alternates: { canonical: '/feedback' },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}