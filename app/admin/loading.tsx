'use client';

import TableSkeleton from '@/components/ui/table-skeleton';
import StatCardSkeleton from '@/components/ui/stat-card-skeleton';

export default function Loading() {
  return (
    <div className="p-8">
      <StatCardSkeleton className="h-10 w-48 mb-6" />
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}