'use client';

import { motion } from 'framer-motion';
import useCursorTrail from '@/hooks/useCursorTrail';

export default function CursorTrail() {
  const { particles, containerRef } = useCursorTrail();

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={`${p.createdAt}-${i}`}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute w-2 h-2 rounded-full bg-gold"
          style={{ left: p.x, top: p.y }}
        />
      ))}
    </div>
  );
}