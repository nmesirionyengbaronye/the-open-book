import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { DataDeletionClient } from './DataDeletionClient';

export const metadata: Metadata = pageMeta({
  title: 'Data Deletion Request',
  description: 'Submit a request to delete your personal data from Uni UI. We process requests within 30 days.',
  keywords: [
    'Uni UI data deletion', 'delete personal data', 'right to be forgotten', 'NDPA data deletion',
    'remove my data Uni UI', 'data privacy Nigeria',
  ],
  path: '/data-deletion',
});

export default function DataDeletionPage() {
  return <DataDeletionClient />;
}