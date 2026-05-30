'use client';

import TableSkeleton from '@/components/ui/table-skeleton';

export default function Loading() {
  return (
    <div className="py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <TableSkeleton />
      </div>
    </div>
  );
}