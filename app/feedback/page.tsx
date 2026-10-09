import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { FeedbackClient } from './FeedbackClient';

export const metadata: Metadata = pageMeta({
  title: 'Feedback — Help Us Build Better',
  description: 'Share your ideas and feedback to help shape the future of Uni UI for Nigerian students.',
  keywords: [
    'Uni UI feedback', 'student feedback', 'feature requests', 'product suggestions',
    'improve Uni UI', 'student voice Nigeria',
  ],
  path: '/feedback',
});

export default function FeedbackPage() {
  return <FeedbackClient />;
}