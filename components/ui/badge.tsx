'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold bg-[#D4AF37] text-[#0A0A0F]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;