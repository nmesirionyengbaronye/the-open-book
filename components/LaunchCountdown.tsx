'use client';

import { useEffect, useState } from 'react';

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const launchDate = new Date(
      process.env.NEXT_PUBLIC_LAUNCH_DATE || '2026-06-01'
    ).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center mb-6">
      <div className="rounded-lg border border-gold/30 px-6 py-3 text-sm flex items-center gap-3 animate-pulse">
        <div className="text-gold">⏳</div>
        <div className="space-y-1 text-center">
          <div className="font-mono text-xs text-gold/80 uppercase">LAUNCH IN</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-gold">{timeLeft.days}</span>
            <span className="text-xs text-gold/50">d</span>
            <span className="text-2xl font-display font-bold text-gold">{timeLeft.hours}</span>
            <span className="text-xs text-gold/50">h</span>
            <span className="text-2xl font-display font-bold text-gold">{timeLeft.minutes}</span>
            <span className="text-xs text-gold/50">m</span>
          </div>
        </div>
      </div>
    </div>
  );
}