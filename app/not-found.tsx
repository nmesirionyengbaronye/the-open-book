'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    console.error('404 error: User attempted to access a route that does not exist');
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-display font-bold text-gold mb-4">404</h1>
        <p className="text-muted-foreground mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background gold-glow-hover"
        >
          <Home className="h-4 w-4" />
          Go Home
        </button>
      </div>
    </div>
  );
}
