'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function fireConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#D4AF37', '#facc15', '#22c55e', '#3b82f6'],
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#D4AF37', '#facc15', '#22c55e', '#3b82f6'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export default function ConfettiCelebration({ trigger }: { trigger: number }) {
  useEffect(() => {
    if (trigger > 0) {
      fireConfetti();
    }
  }, [trigger]);

  return null;
}
