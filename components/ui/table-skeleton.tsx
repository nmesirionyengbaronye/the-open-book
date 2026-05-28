"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  cols = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex items-center space-x-4 pb-2 border-b border-white/10">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-1/4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center space-x-4 py-3 border-b border-white/5 last:border-0"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-6 w-1/4" />
          ))}
        </div>
      ))}
    </div>
  );
}
