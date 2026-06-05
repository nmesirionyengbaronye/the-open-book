'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'KeyB', 'KeyA'
];

/**
 * useKonamiCode Hook
 * 
 * Listens for the Konami code sequence and triggers a state change and optional callback.
 * Persists the unlocked state in localStorage.
 */
export default function useKonamiCode(onUnlock?: () => void) {
  const [unlocked, setUnlocked] = useState(false);
  const sequenceRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('uniui-konami') : null;
    if (stored === 'true') {
      setUnlocked(true);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Reset sequence if too much time passes between key presses (optional but robust)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      sequenceRef.current = 0;
    }, 5000);

    if (e.code === KONAMI_CODE[sequenceRef.current]) {
      sequenceRef.current++;
      
      if (sequenceRef.current === KONAMI_CODE.length) {
        setUnlocked(true);
        localStorage.setItem('uniui-konami', 'true');
        sequenceRef.current = 0;
        if (onUnlock) onUnlock();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    } else {
      // Allow starting over if the first key is pressed twice or similar
      sequenceRef.current = e.code === KONAMI_CODE[0] ? 1 : 0;
    }
  }, [onUnlock]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleKeyDown]);

  return unlocked;
}
