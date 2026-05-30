'use client';

import StatCardSkeleton from '@/components/ui/stat-card-skeleton';

export default function Loading() {
  return (
    <div className="py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    </div>
  );
}