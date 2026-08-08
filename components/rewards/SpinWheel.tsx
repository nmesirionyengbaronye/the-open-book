'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import { toast } from 'sonner';

const SIZE = 256; // logical canvas size (matches h-64 w-64)
// Distinct, non-repeating prize values — these mirror lib/rewards PRIZES so
// every wedge is actually winnable and no number repeats on the wheel.
// Built from a de-duplicated set so a value can never appear in two wedges.
const PRIZE_VALUES = [200, 500, 1000, 2000, 5000, 10000];
const PRIZE_COLORS: Record<number, string> = {
  200: '#D4AF37', // gold
  500: '#3B82F6', // blue
  1000: '#EF4444', // red
  2000: '#22C55E', // green
  5000: '#A855F7', // purple
  10000: '#F59E0B', // amber
};
const SEGMENTS = Array.from(new Set(PRIZE_VALUES)).map((prize) => ({
  prize,
  color: PRIZE_COLORS[prize],
}));
const N = SEGMENTS.length;
const SEG = 360 / N;

function drawWheel(canvas: HTMLCanvasElement) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  canvas.width = SIZE * dpr;
  canvas.height = SIZE * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, SIZE, SIZE);
  const c = SIZE / 2;

  for (let i = 0; i < N; i++) {
    const start = ((i * SEG - 90) * Math.PI) / 180;
    const end = (((i + 1) * SEG - 90) * Math.PI) / 180;

    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.arc(c, c, c - 2, start, end);
    ctx.closePath();
    ctx.fillStyle = SEGMENTS[i].color;
    ctx.fill();

    // Segment label
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(((i + 0.5) * SEG - 90) * (Math.PI / 180));
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0A0A0F';
    ctx.font = 'bold 15px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('₦' + SEGMENTS[i].prize.toLocaleString(), c - 14, 0);
    ctx.restore();
  }

  // Outer rim
  ctx.beginPath();
  ctx.arc(c, c, c - 2, 0, Math.PI * 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(212,175,55,0.6)';
  ctx.stroke();
}

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
  const rotRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) drawWheel(canvasRef.current);
  }, []);

  async function spin() {
    if (tickets < 1) {
      toast.error('No spin tickets left. Open a mystery box!');
      return;
    }
    if (spinning) return;
    setSpinning(true);
    setPrize(null);
    try {
      const res = await fetch('/api/rewards/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Spin failed');

      // Pick a wheel segment whose prize matches the server-awarded prize.
      const matches: number[] = [];
      SEGMENTS.forEach((s, i) => {
        if (s.prize === data.prize) matches.push(i);
      });
      const seg = matches.length ? matches[Math.floor(Math.random() * matches.length)] : 0;

      // Rotate so that segment `seg` lands under the top pointer.
      const turns = 5;
      const target = (-(seg + 0.5) * SEG - rotRef.current) % 360;
      const adj = (target + 360) % 360;
      const next = rotRef.current + turns * 360 + adj;
      rotRef.current = next;
      setRotation(next);

      setTimeout(() => {
        setPrize(data.prize);
        setSpinning(false);
        confetti({ particleCount: 160, spread: 85, origin: { y: 0.5 } });
        toast.success(`🎊 You won ₦${data.prize}!`);
        onSpin?.();
      }, 1700);
    } catch (e: any) {
      setSpinning(false);
      toast.error(e.message || 'Spin failed');
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-4 text-sm font-semibold text-white/80">Spin the Wheel</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          {/* Pointer */}
          <div className="absolute -top-1 left-1/2 z-20 h-0 w-0 -translate-x-1/2 border-x-[11px] border-t-[18px] border-x-transparent border-t-[#D4AF37] drop-shadow" />
          {/* Rotating wheel */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: rotation }}
            transition={{ duration: 1.7, ease: 'easeOut' }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: SIZE, height: SIZE }}
              className="rounded-full"
            />
          </motion.div>
          {/* Fixed center hub */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-white/10 bg-[#0A0A0F] text-[#D4AF37] shadow-[inset_0_0_20px_rgba(212,175,55,0.3)]">
              <Trophy className="h-7 w-7" />
            </div>
          </div>
        </div>

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
