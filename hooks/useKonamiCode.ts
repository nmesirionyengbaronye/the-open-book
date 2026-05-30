'use client';

import { useState, useEffect, useRef } from 'react';

const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

export default function useKonamiCode() {
  const [unlocked, setUnlocked] = useState(false);
  const sequenceRef = useRef(0);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('uniui-konami') : null;
    if (stored) setUnlocked(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KONAMI[sequenceRef.current]) {
        sequenceRef.current++;
        if (sequenceRef.current === KONAMI.length) {
          setUnlocked(true);
          localStorage.setItem('uniui-konami', 'true');
          sequenceRef.current = 0;
        }
      } else {
        sequenceRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return unlocked;
}