'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardShortcuts } from '@/lib/keyboard-shortcuts';

const ADMIN_SHORTCUTS = {
  'ctrl+shift+d': () => window.location.href = '/admin/dashboard',
  'ctrl+shift+p': () => window.location.href = '/admin/payments',
  'ctrl+shift+w': () => window.location.href = '/admin/waitlist',
  'ctrl+shift+r': () => window.location.href = '/admin/rewards',
  'ctrl+shift+b': () => window.location.href = '/admin/broadcast-queue',
  'ctrl+shift+f': () => window.location.href = '/admin/fraud',
  'ctrl+shift+n': () => window.location.href = '/admin/notes',
  'ctrl+shift+l': () => window.location.href = '/admin/webhook-logs',
  'ctrl+shift+g': () => window.location.href = '/admin',
};

export function useAdminShortcuts() {
  const router = useRouter();

  const shortcuts: Record<string, () => void> = {};
  for (const [key, href] of Object.entries(ADMIN_SHORTCUTS)) {
    shortcuts[key] = useCallback(() => {
      router.push(href.toString().replace('window.location.href = ', '').replace(/'/g, ''));
    }, [router]);
  }

  // Simpler approach
  useKeyboardShortcuts({
    'ctrl+shift+d': () => { window.location.href = '/admin/dashboard'; },
    'ctrl+shift+p': () => { window.location.href = '/admin/payments'; },
    'ctrl+shift+w': () => { window.location.href = '/admin/waitlist'; },
    'ctrl+shift+r': () => { window.location.href = '/admin/rewards'; },
    'ctrl+shift+b': () => { window.location.href = '/admin/broadcast-queue'; },
    'ctrl+shift+f': () => { window.location.href = '/admin/fraud'; },
    'ctrl+shift+n': () => { window.location.href = '/admin/notes'; },
    'ctrl+shift+l': () => { window.location.href = '/admin/webhook-logs'; },
  });
}
