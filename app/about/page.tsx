import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Uni UI – University Uploaded Intelligence',
  description:
    'Uni UI is the place where a Nigerian student\'s entire semester lives: courses, notes, past questions, progress, and study groups — all in one structured platform built from the ground up for Nigerian universities.',
  keywords: [
    'about Uni UI',
    'Uni UI story',
    'FUTO student founder',
    'Nigerian edtech',
    'University Uploaded Intelligence',
    'Nigerian university study app',
    'AI study assistant Nigeria',
    'FUTO',
    'course notes organizer',
    'past questions platform',
    'student productivity Nigeria',
  ],
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}