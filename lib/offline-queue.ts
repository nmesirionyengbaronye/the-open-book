'use client';

import { useRef, useEffect, useState } from 'react';

export function useOfflineQueue<T>({
  onOnline,
  onOffline,
  storageKey = 'offline-queue',
}: {
  onOnline: (payload: T) => Promise<void>;
  onOffline?: (payload: T) => void;
  storageKey?: string;
}) {
  const [online, setOnline] = useState(true);
  const queueRef = useRef<T[]>([]);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Restore persisted queue
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) queueRef.current = JSON.parse(saved);
    } catch {
      queueRef.current = [];
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [storageKey]);

  useEffect(() => {
    if (!online) return;
    const queue = queueRef.current;
    if (!queue.length) return;

    const flush = async () => {
      const next: T[] = [];
      for (const item of queue) {
        try {
          await onOnline(item);
        } catch {
          next.push(item);
        }
      }
      queueRef.current = next;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // storage full or unavailable
      }
    };

    flush();
  }, [online, onOnline, storageKey]);

  const enqueue = (payload: T) => {
    queueRef.current = [...queueRef.current, payload];
    try {
      localStorage.setItem(storageKey, JSON.stringify(queueRef.current));
    } catch {
      // ignore
    }
    onOffline?.(payload);
  };

  return { online, enqueue };
}
