'use client';

import { useEffect, useState } from 'react';

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const launchDate = new Date(
      process.env.NEXT_PUBLIC_LAUNCH_DATE || '2026-07-10'
    ).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        setIsLaunched(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );

      setTimeLeft({ days, hours, minutes });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  if (isLaunched) {
    return (
      <div className="flex justify-center items-center mb-10">
        <div className="glass-strong rounded-2xl px-8 py-4 border-emerald-500/30 flex items-center gap-4 animate-fade-in gold-glow">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-emerald-400 font-display font-bold tracking-wider text-sm">SYSTEMS ONLINE</span>
            <span className="text-[10px] text-emerald-400/60 uppercase tracking-[0.2em]">Second Semester Material Processing Active</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-12 px-5">
      <div className="text-[10px] uppercase tracking-[0.4em] text-gold/60 mb-6 font-medium">
        Launch Sequence Initiated
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <CountdownUnit value={timeLeft.days} label="Days" />
        <div className="text-gold/30 text-2xl font-display mt-[-20px]">:</div>
        <CountdownUnit value={timeLeft.hours} label="Hours" />
        <div className="text-gold/30 text-2xl font-display mt-[-20px]">:</div>
        <CountdownUnit value={timeLeft.minutes} label="Minutes" />
      </div>
      <div className="mt-8 text-center max-w-md">
        <p className="text-xs text-muted-foreground leading-relaxed tracking-wide">
          Deploying <span className="text-gold">University Uploaded Intelligence</span> tailored for your second‑semester exams. 
          Queue is moving fast.
        </p>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="glass-strong w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border-gold/20 relative group overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tighter">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-gold/60 font-medium">
        {label}
      </span>
    </div>
  );
}