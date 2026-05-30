'use client';

import Skeleton from './skeleton';

export default function TableSkeleton() {
  const widths = ['60%', '40%', '80%', '50%', '70%'];
  return (
    <div className="glass-strong rounded-xl p-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-3">
            {widths.map((w, colIdx) => (
              <Skeleton key={colIdx} className="h-4 rounded" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}