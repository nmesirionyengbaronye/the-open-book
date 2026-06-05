'use client';

import { motion } from 'framer-motion';
import useCursorTrail from '@/hooks/useCursorTrail';

export default function CursorTrail() {
  const { particles, containerRef } = useCursorTrail();

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
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