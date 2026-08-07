'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import { toast } from 'sonner';

export default function SpinWheel({
  code,
  tickets,
  onSpin,
}: {
  code: string;
  tickets: number;
  onSpin?: () => void;
}) {
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  async function spin() {
    if (tickets < 1) {
      toast.error('No spin tickets left. Open a mystery box!');
      return;
    }
    setSpinning(true);
    setPrize(null);
    setRotation((r) => r + 1440 + Math.floor(Math.random() * 360));
    try {
      const res = await fetch('/api/rewards/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Spin failed');
      setTimeout(() => {
        setPrize(data.prize);
        setSpinning(false);
        confetti({ particleCount: 160, spread: 85, origin: { y: 0.5 } });
        toast.success(`🎊 You won ₦${data.prize}!`);
        onSpin?.();
      }, 1600);
    } catch (e: any) {
      setSpinning(false);
      toast.error(e.message || 'Spin failed');
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-4 text-sm font-semibold text-white/80">Spin the Wheel</h3>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-[#D4AF37]/50"
          style={{
            background:
              'conic-gradient(from 0deg, #D4AF37 0deg 40deg, #1a1a22 40deg 80deg, #D4AF37 80deg 120deg, #1a1a22 120deg 160deg, #D4AF37 160deg 200deg, #1a1a22 200deg 240deg, #D4AF37 240deg 280deg, #1a1a22 280deg 320deg, #D4AF37 320deg 360deg)',
          }}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0A0A0F] text-[#D4AF37]">
            <Trophy className="h-8 w-8" />
          </div>
        </motion.div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || tickets < 1}
          className="rounded-full bg-[#D4AF37] px-6 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {spinning ? 'Spinning…' : tickets > 0 ? `Spin (${tickets} left)` : 'No tickets'}
        </button>

        {prize !== null && !spinning && (
          <div className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-center text-sm text-[#D4AF37]">
            You won <strong>₦{prize}</strong> — added to your wallet!
          </div>
        )}
      </div>
    </div>
  );
}
