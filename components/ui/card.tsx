'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export default function Card({ className, children, hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6',
        hoverable && 'hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}