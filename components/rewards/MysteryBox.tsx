'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PackageOpen, Gift } from 'lucide-react';
import { toast } from 'sonner';

export default function MysteryBox({
  code,
  boxesDue,
  boxesOpened,
  onAwarded,
}: {
  code: string;
  boxesDue: number;
  boxesOpened: number;
  onAwarded?: () => void;
}) {
  const eligible = Math.max(0, boxesDue - boxesOpened);
  const [opening, setOpening] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<{ box: number; tickets: number } | null>(null);

  async function openBox(boxNumber: number) {
    if (eligible <= 0 || opening) return;
    setOpening(boxNumber);
    setRevealed(null);
    try {
      const res = await fetch('/api/rewards/box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, boxNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not open box');
      setTimeout(() => {
        setRevealed({ box: boxNumber, tickets: data.tickets });
        setOpening(null);
        confetti({ particleCount: 130, spread: 75, origin: { y: 0.6 } });
        toast.success(`🎟️ You won ${data.tickets} spin ticket${data.tickets > 1 ? 's' : ''}!`);
        onAwarded?.();
      }, 950);
    } catch (e: any) {
      setOpening(null);
      toast.error(e.message || 'Could not open box');
    }
  }

  if (eligible <= 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-white/50">
        <Gift className="mx-auto mb-2 h-6 w-6 text-[#D4AF37]" />
        No mystery boxes yet. Refer 7 verified friends to unlock your first one.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-1 text-sm font-semibold text-white/80">
        Mystery Boxes ({boxesOpened} opened · {eligible} available)
      </h3>
      <p className="mb-4 text-xs text-white/50">Choose a box — each hides 1, 2 or 5 spin tickets.</p>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((b) => (
          <motion.button
            key={b}
            type="button"
            disabled={!!opening}
            onClick={() => openBox(b)}
            whileHover={{ scale: opening === b ? 1 : 1.05 }}
            animate={opening === b ? { rotate: [0, -8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.5, repeat: opening === b ? Infinity : 0 }}
            className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-b from-[#D4AF37]/20 to-transparent text-3xl disabled:opacity-60"
          >
            <PackageOpen className="h-8 w-8 text-[#D4AF37]" />
            <span className="mt-1 text-xs text-white/60">Box {b}</span>
          </motion.button>
        ))}
      </div>
      {revealed && (
        <div className="mt-4 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-3 text-center text-sm text-[#D4AF37]">
          🎉 Box {revealed.box} contained <strong>{revealed.tickets} spin ticket{revealed.tickets > 1 ? 's' : ''}</strong>!
        </div>
      )}
    </div>
  );
}
