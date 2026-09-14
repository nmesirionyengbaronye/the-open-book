'use client';

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";

const QUOTES = [
  "I stared at the textbook for three hours. I still couldn't solve a single problem.",
  "Everyone around me seemed to get it. I started to think maybe I just wasn't smart enough.",
  "One YouTube video, then another. A borrowed handout. I began to piece things together, slowly.",
  "I realized the problem wasn't me — it was the lack of organized, reliable material. Uni UI gave me that.",
];

const PAGE_SNIPPETS = [
  ["MTH 201", "∫ x² dx = x³/3 + C", "Integration by Parts"],
  ["PHY 202", "E = mc²", "F = ma · μ"],
  ["CSC 211", "O(n log n)", "while (i < n) {"],
  ["BCH 210", "Glycolysis", "ATP → ADP + Pᵢ"],
  ["EEE 301", "V = IR", "P = V²/R"],
  ["MEE 305", "σ = F/A", "τ = T·r / J"],
];

function Page({
  progress, index, total, side,
}: { progress: MotionValue<number>; index: number; total: number; side: "left" | "right" }) {
  const angle = (index / total) * Math.PI * 2;
  const dx = Math.cos(angle) * (180 + (index % 3) * 40) * (side === "left" ? -1 : 1);
  const dy = Math.sin(angle) * (120 + (index % 4) * 25) - 40;
  const rot = ((index * 37) % 90) - 45;

  const x = useTransform(progress, [0, 0.3, 0.7, 1], [0, dx, dx, 0]);
  const y = useTransform(progress, [0, 0.3, 0.7, 1], [0, dy, dy, 0]);
  const rotate = useTransform(progress, [0, 0.3, 0.7, 1], [0, rot, rot, 0]);
  const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0.95, 1, 1, 0.95]);

  const snippet = PAGE_SNIPPETS[index % PAGE_SNIPPETS.length];

  return (
    <motion.div
      style={{
        x: useSpring(x, { stiffness: 80, damping: 20, mass: 0.8 }),
        y: useSpring(y, { stiffness: 80, damping: 20, mass: 0.8 }),
        rotate: useSpring(rotate, { stiffness: 80, damping: 20, mass: 0.8 }),
        opacity,
        zIndex: 5 + index,
      }}
      className="absolute left-1/2 top-1/2 paper-page rounded-sm shadow-2xl"
    >
      <div
        className="w-[140px] h-[190px] sm:w-[170px] sm:h-[230px] p-3 -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-zinc-700/80 font-mono"
        style={{ transform: `translate(-50%,-50%)` }}
      >
        <div className="font-bold text-zinc-900 mb-2">{snippet[0]}</div>
        <div className="mb-1">{snippet[1]}</div>
        <div className="opacity-70">{snippet[2]}</div>
        <div className="mt-3 space-y-1 opacity-50">
          <div className="h-px bg-zinc-700/30" />
          <div className="h-px bg-zinc-700/30 w-4/5" />
          <div className="h-px bg-zinc-700/30 w-2/3" />
          <div className="h-px bg-zinc-700/30 w-3/4" />
        </div>
      </div>
    </motion.div>
  );
}

function Cover({ progress, side }: { progress: MotionValue<number>; side: "left" | "right" }) {
  const sign = side === "left" ? -1 : 1;
  const x = useTransform(progress, [0, 0.3, 0.7, 1], [0, sign * 280, sign * 280, 0]);
  const rotate = useTransform(progress, [0, 0.3, 0.7, 1], [0, sign * -25, sign * -25, 0]);
  const sx = useSpring(x, { stiffness: 70, damping: 18, mass: 0.9 });
  const sr = useSpring(rotate, { stiffness: 70, damping: 18, mass: 0.9 });

  return (
    <motion.div
      style={{ x: sx, rotate: sr }}
      className="absolute left-1/2 top-1/2 -translate-y-1/2"
    >
      <div
        className={`w-[160px] h-[230px] sm:w-[190px] sm:h-[270px] rounded-sm shadow-2xl ${
          side === "left" ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{
          background:
            "linear-gradient(135deg, oklch(0.28 0.04 50), oklch(0.18 0.03 40))",
          borderLeft: side === "right" ? "3px solid oklch(0.78 0.13 85)" : undefined,
          borderRight: side === "left" ? "3px solid oklch(0.78 0.13 85)" : undefined,
        }}
      >
        <div className="h-full w-full p-5 flex flex-col justify-between">
          <div className="text-gold/80 font-display text-[10px] tracking-[0.3em]">UNI · UI</div>
          <div>
            <div className="text-gold font-display text-base leading-tight">University Uploaded Intelligence</div>
            <div className="mt-2 h-px bg-gold/40" />
            <div className="text-gold/60 text-[10px] mt-2">FUTO Live · Semester Materials</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Spine({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.2, 0.4], [1, 0.4, 0]);
  const y = useTransform(progress, [0, 0.3], [0, 30]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-[260px] rounded-sm"
    >
      <div className="h-full w-full bg-gradient-to-b from-amber-900 via-amber-950 to-amber-900 relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gold" />
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gold" />
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gold" />
      </div>
    </motion.div>
  );
}

function TornCard({
  progress, quote, index,
}: { progress: MotionValue<number>; quote: string; index: number }) {
  const start = 0.1 + index * 0.22;
  const end = Math.min(1, start + 0.5);
  const opacity = useTransform(progress, [Math.max(0, start - 0.05), start, end, Math.min(1, end + 0.05)], [0, 1, 1, 0]);
  const y = useTransform(progress, [Math.max(0, start - 0.05), start], [20, 0]);
  const positions = [
    "top-[10%] left-[4%] -rotate-6 sm:left-[8%]",
    "top-[18%] right-[4%] rotate-3 sm:right-[10%]",
    "bottom-[28%] left-[6%] rotate-2 sm:left-[12%]",
    "bottom-[18%] right-[6%] -rotate-4 sm:right-[14%]",
  ];

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute ${positions[index]} max-w-[200px] sm:max-w-[260px] z-20 pointer-events-none`}
    >
      <div className="torn-paper glass p-4 sm:p-5">
        <p className="font-hand text-gold-bright text-base sm:text-xl leading-snug">
          "{quote}"
        </p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.85, 0.95], [0, 1, 1, 0]);
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.8, 0.9], [0, 1, 0]);
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.8, 0.9], [0, 1, 0]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="hero" className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-surface" />

        <div className="absolute inset-0 grid place-items-center scale-75 sm:scale-100 will-change-transform">
          <motion.div
            className="relative w-[240px] h-[320px] will-change-transform"
            initial={false}
            style={{ transform: 'translateZ(0)' }}
          >
            <Spine progress={scrollYProgress} />
            <Cover progress={scrollYProgress} side="left" />
            <Cover progress={scrollYProgress} side="right" />
            {Array.from({ length: 20 }).map((_, i) => (
              <Page key={i} progress={scrollYProgress} index={i} total={20} side={i % 2 ? "right" : "left"} />
            ))}
          </motion.div>
        </div>

        {QUOTES.map((q, i) => (
          <TornCard key={i} progress={scrollYProgress} quote={q} index={i} />
        ))}

        <motion.div
          style={{ opacity: headlineOpacity }}
          className="absolute inset-x-0 bottom-10 sm:bottom-16 z-30 px-5 text-center will-change-transform"
        >
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-gold leading-[1.05]">
            YOUR SEMESTER, <span className="text-gold-bright">UPLOADED.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground">
            UPLOAD YOUR COURSE MATERIALS. GET ACCURATE ANSWERS SOURCED FROM YOUR OWN NOTES.
            BUILT BY NIGERIAN STUDENTS, FOR NIGERIAN STUDENTS. STARTED AT FUTO.
          </p>
          <motion.button
            style={{ opacity: buttonOpacity }}
            onClick={() => scrollTo("join")}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover will-change-transform"
          >
            JOIN THE WAITLIST <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.div
            style={{ opacity: scrollPromptOpacity }}
            className="mt-6 text-[10px] tracking-[0.3em] text-muted-foreground/60 uppercase"
          >
            'Uni UI — live at FUTO now'
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}