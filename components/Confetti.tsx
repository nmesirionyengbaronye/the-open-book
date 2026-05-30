'use client';

import confetti from 'canvas-confetti';

export default function triggerConfetti() {
  confetti({
    particleCount: 140,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#D4AF37', '#FFD700', '#FFFFFF'],
  });
}

export function useConfetti() {
  return triggerConfetti;
}