import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Uni UI — University Uploaded Intelligence',
  description: 'Built by a student in Owerri who was tired of failing and scavenging for materials.',
};

export default function AboutPage() {
  return <AboutClient />;
}