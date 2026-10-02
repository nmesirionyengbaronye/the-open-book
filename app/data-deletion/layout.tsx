import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Data Deletion',
  description: 'Request deletion of your personal data held by Uni UI.',
  // Deliberately not indexed, but linked from the Privacy Policy so the route
  // stays discoverable for anyone exercising their NDPA rights.
  robots: { index: false, follow: true },
  alternates: { canonical: '/data-deletion' },
};

export default function DataDeletionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}