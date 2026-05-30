'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Dialog({ open, onOpenChange, title, children, className }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn('fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-strong rounded-2xl p-6 z-50 max-w-md w-full', className)}
          >
            <div className="flex items-start justify-between mb-4">
              {title && <h2 className="font-display text-xl text-gold">{title}</h2>}
              <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-gold">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}