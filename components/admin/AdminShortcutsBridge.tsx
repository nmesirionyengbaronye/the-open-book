'use client';

import { useAdminShortcuts } from '@/lib/admin-shortcuts';

export function AdminShortcutsBridge() {
  useAdminShortcuts();
  return null;
}
