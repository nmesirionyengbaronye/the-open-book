'use client';

import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="text-center max-w-md glass-strong rounded-2xl p-8">
        <h2 className="text-2xl font-display font-bold text-gold mb-3">Waitlist Error</h2>
        <p className="text-muted-foreground mb-6">Could not join the waitlist. Please try again.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-5 py-2.5 rounded-lg bg-gold text-background font-semibold gold-glow-hover">
            Retry
          </button>
          <Link href="/" className="px-5 py-2.5 rounded-lg glass border-gold/40 hover:bg-gold/10">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}