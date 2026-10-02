import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { pageMeta, webPageSchema } from '@/lib/seo';

const DESCRIPTION =
  'Join the Uni UI waitlist. Upload your course materials, get AI-powered answers ' +
  'grounded in your own notes, and prepare for your exams. Built for Nigerian ' +
  'university students. Live at FUTO now.';

export const metadata: Metadata = pageMeta({
  title: 'Uni UI – University Uploaded Intelligence | Your Semester, Uploaded',
  description: DESCRIPTION,
  keywords: [
    'Uni UI', 'AI study tool Nigeria', 'Nigerian university students', 'exam preparation',
    'upload lecture notes', 'AI tutor', 'course-grounded AI', 'past questions',
    'JAMB preparation', 'WAEC preparation', 'FUTO', 'UNILAG', 'university waitlist',
    'study app Nigeria', 'semester notes', 'academic AI assistant',
  ],
  path: '/',
  absolute: true,
});

export default function Home() {
  return (
    <>
      <SeoJsonLd
        data={webPageSchema({
          name: 'Uni UI – University Uploaded Intelligence',
          description: DESCRIPTION,
          path: '/',
        })}
      />
      <HomeClient />
    </>
  );
}