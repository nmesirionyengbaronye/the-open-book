'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Skeleton from './skeleton';

export default function StatCardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('glass rounded-xl p-6', className)} {...props}>
      <Skeleton className="h-8 w-16 mb-3" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}