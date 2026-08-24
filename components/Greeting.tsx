'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const STORAGE_KEY = 'uni_ui_greeting_dismissed';

export default function Greeting() {
  const [greeting, setGreeting] = useState('');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(() => localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) return 'GOOD MORNING. YOU\'RE UP EARLY — LET\'S GET THIS SEMESTER SORTED.';
      if (hour >= 11 && hour < 16) return 'GOOD AFTERNOON. DON\'T LET THE LECTURE NOTES PILE UP.';
      if (hour >= 16 && hour < 22) return 'GOOD EVENING. TIME TO UPLOAD YOUR MATERIALS AND STUDY SMARTER.';
      return 'STILL AWAKE? THE BEST IDEAS COME LATE. WELCOME TO UNI UI.';
    };
    setGreeting(getGreeting());
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <AnimatePresence>
      {!dismissed && greeting && (
        <motion.div
          key="greeting"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 glass rounded-full px-4 py-2 pr-2 flex items-center gap-3"
        >
          <span className="text-gold text-xs font-display tracking-wider">{greeting}</span>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss greeting"
            className="flex-shrink-0 grid place-items-center w-5 h-5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
