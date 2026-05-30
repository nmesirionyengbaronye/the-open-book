'use client';

import Skeleton from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="py-20 px-5 bg-surface/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-4 w-40 mx-auto mb-3" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="mt-3 h-4 w-48 mx-auto" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-5">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <div className="h-2 rounded-full bg-white/5">
                <Skeleton className="h-2 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}