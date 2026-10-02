import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About – The Story Behind Uni UI',
  description:
    'Built by a FUTO student to help Nigerian undergraduates prepare for exams using their own course materials.',
  keywords: [
    'about Uni UI', 'Uni UI story', 'FUTO student founder', 'Nigerian edtech',
    'why Uni UI was built',
  ],
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}