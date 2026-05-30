'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none';
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5',
      lg: 'px-6 py-3 text-lg',
    };
    const variantClasses = {
      primary: 'bg-[#D4AF37] text-[#0A0A0F] hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]',
      outline: 'bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]',
      ghost: 'bg-transparent text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]',
    };
    return (
      <button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;