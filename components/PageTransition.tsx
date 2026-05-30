'use client';

import { motion } from 'framer-motion';

const spring = { type: 'spring', stiffness: 100, damping: 12, mass: 0.5 } as const;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        key="transition"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 h-0.5 bg-gold z-[9999] origin-left"
      />
      <motion.div
        key="page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={spring}
      >
        {children}
      </motion.div>
    </>
  );
}