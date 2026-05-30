import { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Uni UI',
  description: 'Admin dashboard for managing the Uni UI waitlist.',
};

export default function AdminPage() {
  return <AdminClient />;
}