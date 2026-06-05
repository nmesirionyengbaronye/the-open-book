'use client';

import { useRef, useCallback } from 'react';

type SoundEffect = 'ding' | 'chime' | 'success' | 'error' | 'unlock';

/**
 * useSound Hook
 * 
 * Provides a simple interface for playing synthesized sound effects using the Web Audio API.
 * Handles AudioContext lazy-initialization to comply with browser autoplay policies.
 */
export default function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) => {
    const ctx = initAudio();
    if (!ctx) return;

    // Resume context if suspended (common in some browsers)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [initAudio]);

  const playSound = useCallback((sound: SoundEffect) => {
    switch (sound) {
      case 'ding':
        playTone(800, 0.15);
        break;
      case 'chime':
        playTone(1200, 0.3);
        break;
      case 'success':
        playTone(523.25, 0.1, 'sine'); // C5
        setTimeout(() => playTone(659.25, 0.1, 'sine'), 100); // E5
        setTimeout(() => playTone(783.99, 0.3, 'sine'), 200); // G5
        break;
      case 'error':
        playTone(220, 0.2, 'sawtooth', 0.05); // A3
        break;
      case 'unlock':
        playTone(440, 0.1);
        setTimeout(() => playTone(880, 0.2), 100);
        break;
    }
  }, [playTone]);

  return { play: playSound };
}
