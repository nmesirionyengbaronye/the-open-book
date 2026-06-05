'use client';

import { useAdminData } from '@/hooks/useAdminData';
import { WaitlistTable } from '@/components/admin/WaitlistTable';
import { Loader2 } from 'lucide-react';

export default function AdminWaitlist() {
  const { data, loading, isAuthChecked } = useAdminData();

  if (!isAuthChecked || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Waitlist Management</h1>
        <p className="text-muted-foreground">Detailed view and management of all registered students.</p>
      </div>
      <WaitlistTable waitlist={data.waitlist} />
    </div>
  );
}
