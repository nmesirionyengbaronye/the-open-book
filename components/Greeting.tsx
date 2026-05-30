'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Greeting() {
  const [greeting, setGreeting] = useState('');

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

  if (!greeting) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40 glass rounded-full px-6 py-2"
    >
      <span className="text-gold text-xs font-display tracking-wider">{greeting}</span>
    </motion.div>
  );
}