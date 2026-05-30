'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="text-center max-w-md glass-strong rounded-2xl p-8">
        <h2 className="text-2xl font-display font-bold text-gold mb-3">Something went wrong.</h2>
        <p className="text-muted-foreground mb-6">Please refresh or try again.</p>
        <button onClick={reset} className="px-6 py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover">
          Reload Page
        </button>
      </div>
    </div>
  );
}