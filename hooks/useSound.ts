'use client';

import { useRef, useCallback } from 'react';

export default function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((freq: number, duration: number) => {
    if (typeof window === 'undefined') return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  return {
    play: (sound: 'ding' | 'chime') => playTone(sound === 'ding' ? 800 : 1200, sound === 'ding' ? 0.15 : 0.3),
  };
}