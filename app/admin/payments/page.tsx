'use client';

import { useAdminData } from '@/hooks/useAdminData';
import PaymentsTable from '@/components/admin/PaymentsTable';
import { Loader2 } from 'lucide-react';

export default function AdminPayments() {
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
        <h1 className="font-display text-3xl font-bold tracking-tight">Payment Management</h1>
        <p className="text-muted-foreground">Track payouts, mark payments, and review payment history.</p>
      </div>
      <PaymentsTable />
    </div>
  );
}
