import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Uni UI \u2013 The Story Behind the Platform',
  description: 'Built by a FUTO student to help Nigerian undergraduates pass exams without stress.',
};

export default function AboutPage() {
  return <AboutClient />;
}