import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Bookmark } from "lucide-react";
import * as THREE from "three";

/* ---------- Helpers ---------- */

function makePageTexture(lines: string[]): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f6f1e3";
  ctx.fillRect(0, 0, 512, 512);
  // faint ruled lines
  ctx.strokeStyle = "rgba(80,60,30,0.08)";
  ctx.lineWidth = 1;
  for (let y = 60; y < 512; y += 28) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(492, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#2a2218";
  ctx.font = "bold 28px Georgia, serif";
  lines.forEach((l, i) => ctx.fillText(l, 30, 80 + i * 50));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const SAMPLE_CONTENT = [
  ["E = mc²", "Energy-mass", "equivalence", "Einstein, 1905"],
  ["History: 1914", "Great War begins", "Sarajevo", "Archduke Ferdinand"],
  ["DNA Replication", "5' → 3'", "Helicase unwinds", "Polymerase builds"],
  ["∫ x dx = x²/2", "Integration", "by parts:", "∫u dv = uv − ∫v du"],
  ["Photosynthesis", "6CO₂ + 6H₂O", "→ C₆H₁₂O₆", "+ 6O₂"],
  ["Pythagoras", "a² + b² = c²", "Right triangles", "Greek, ~500 BC"],
  ["Newton's 2nd", "F = ma", "Force equals", "mass × accel"],
  ["Periodic Table", "H He Li Be B", "C N O F Ne", "Na Mg Al Si"],
];

/* ---------- 3D Pieces ---------- */

const PAGE_COUNT = 24;

type Scatter = { pos: [number, number, number]; rot: [number, number, number] };

function useScatterTargets(): Scatter[] {
  return useMemo(() => {
    const arr: Scatter[] = [];
    for (let i = 0; i < PAGE_COUNT; i++) {
      // random offset within sphere of radius 3
      const r = 1.5 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        rot: [
          (Math.random() - 0.5) * Math.PI,
          (Math.random() - 0.5) * Math.PI,
          (Math.random() - 0.5) * Math.PI,
        ],
      });
    }
    return arr;
  }, []);
}

function Page({
  index,
  progress,
  scatter,
  texture,
}: {
  index: number;
  progress: MotionValue<number>;
  scatter: Scatter;
  texture: THREE.CanvasTexture;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  // closed position: stacked inside the book
  const closedY = -0.18 + (index / PAGE_COUNT) * 0.36;

  useFrame((state) => {
    const p = progress.get();
    // 0→0.33 scatter, 0.33→0.5 hold, 0.5→1 reassemble
    let t = 0;
    if (p < 0.33) t = p / 0.33;
    else if (p < 0.5) t = 1;
    else t = 1 - (p - 0.5) / 0.5;
    t = Math.max(0, Math.min(1, t));

    const breath = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.05;

    ref.current.position.x = scatter.pos[0] * t;
    ref.current.position.y = closedY + scatter.pos[1] * t + breath * t;
    ref.current.position.z = scatter.pos[2] * t;
    ref.current.rotation.x = scatter.rot[0] * t;
    ref.current.rotation.y = scatter.rot[1] * t;
    ref.current.rotation.z = scatter.rot[2] * t;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.4, 0.02, 1.0]} />
      <meshStandardMaterial map={texture} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

function Cover({
  side,
  progress,
}: {
  side: "left" | "right";
  progress: MotionValue<number>;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const sign = side === "left" ? -1 : 1;

  useFrame(() => {
    const p = progress.get();
    let t = 0;
    if (p < 0.33) t = p / 0.33;
    else if (p < 0.5) t = 1;
    else t = 1 - (p - 0.5) / 0.5;
    t = Math.max(0, Math.min(1, t));

    ref.current.position.x = sign * (0.0 + t * 1.6);
    ref.current.position.y = 0;
    ref.current.rotation.z = sign * t * 0.4;
    ref.current.rotation.y = sign * t * -0.6;
  });

  return (
    <mesh ref={ref} position={[sign * 0.0, 0, 0]}>
      <boxGeometry args={[1.5, 0.5, 1.05]} />
      <meshStandardMaterial color="#3a1f10" metalness={0.3} roughness={0.7} />
    </mesh>
  );
}

function Spine({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(() => {
    const p = progress.get();
    let t = 0;
    if (p < 0.33) t = p / 0.33;
    else if (p < 0.5) t = 1;
    else t = 1 - (p - 0.5) / 0.5;
    t = Math.max(0, Math.min(1, t));
    ref.current.position.y = -t * 1.5;
    matRef.current.opacity = 1 - t;
    matRef.current.transparent = true;
  });

  return (
    <mesh ref={ref} position={[0, 0, -0.52]}>
      <boxGeometry args={[1.5, 0.5, 0.08]} />
      <meshStandardMaterial
        ref={matRef}
        color="#2a160a"
        metalness={0.4}
        roughness={0.6}
      />
    </mesh>
  );
}

function BookGroup({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null!);
  const scatter = useScatterTargets();

  const textures = useMemo(
    () =>
      Array.from({ length: PAGE_COUNT }, (_, i) =>
        makePageTexture(SAMPLE_CONTENT[i % SAMPLE_CONTENT.length]),
      ),
    [],
  );

  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const breath = 1 + Math.sin(t * 0.9) * 0.02;
    group.current.scale.setScalar(breath);
    group.current.position.y = Math.sin(t * 0.6) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.3) * 0.15;
  });

  return (
    <group ref={group}>
      <Cover side="left" progress={progress} />
      <Cover side="right" progress={progress} />
      <Spine progress={progress} />
      {scatter.map((s, i) => (
        <Page
          key={i}
          index={i}
          progress={progress}
          scatter={s}
          texture={textures[i]}
        />
      ))}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 220;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.04}
        color="#9ab4d8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 6, 18]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 5, 4]} intensity={1.6} color="#fff1d6" />
      <pointLight position={[-5, -2, 3]} intensity={0.6} color="#6a8bff" />
      <Particles />
      <BookGroup progress={progress} />
    </>
  );
}

/* ---------- Overlay cards & form ---------- */

const QUOTES = [
  "I stared at the textbook for three hours. I still don't understand any of it.",
  "Everyone else seems to get it. Maybe I'm just not smart enough.",
  "One YouTube video, then another. I piece things together. A small light flickers.",
  "I'm not alone. The right guidance can turn confusion into clarity. This time, I'm ready.",
];

const CARD_POSITIONS = [
  { top: "18vh", left: "8%", rotate: -4 },
  { top: "30vh", right: "8%", rotate: 5 },
  { top: "22vh", left: "12%", rotate: -2 },
  { top: "28vh", right: "10%", rotate: 3 },
];

const TORN_CLIP =
  "polygon(2% 6%, 12% 0%, 38% 4%, 62% 0%, 88% 5%, 100% 12%, 96% 38%, 100% 64%, 97% 90%, 84% 100%, 56% 96%, 30% 100%, 8% 95%, 0% 78%, 4% 50%, 0% 22%)";

function TornCard({
  text,
  progress,
  range,
  style,
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  style: React.CSSProperties;
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [40, 0, 0, -30]);
  return (
    <motion.div
      style={{
        ...style,
        opacity,
        y,
        position: "absolute",
        maxWidth: 320,
        padding: "2rem",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.15)",
        clipPath: TORN_CLIP,
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
      className="text-white"
    >
      <p
        style={{ fontFamily: "'Caveat', cursive" }}
        className="text-2xl md:text-3xl leading-snug"
      >
        {text}
      </p>
    </motion.div>
  );
}

function WaitlistForm({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.82, 0.92], [0, 1]);
  const y = useTransform(progress, [0.82, 0.92], [60, 0]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-auto w-full max-w-md mx-auto px-6 text-center"
    >
      <h2 className="text-4xl md:text-5xl font-semibold text-white mb-3 tracking-tight">
        Join the Waitlist
      </h2>
      <p className="text-white/60 mb-8">
        Learning shouldn't feel like drowning. Be first when we open the doors.
      </p>

      {submitted ? (
        <div
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-8 text-white"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
        >
          <p className="text-lg">You're in. We'll be in touch soon.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSubmitted(true);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-white/30 bg-white/10 backdrop-blur-xl px-5 py-3 text-white placeholder-white/40 outline-none focus:border-white/60 transition"
          />
          <button
            type="submit"
            className="rounded-lg border border-white/30 bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition"
          >
            I Relate
          </button>
        </form>
      )}
    </motion.div>
  );
}

/* ---------- Page ---------- */

export default function WaitlistPage() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container });
  const [sceneReady, setSceneReady] = useState(false);

  // Load Caveat
  useEffect(() => {
    const id = "caveat-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap";
    document.head.appendChild(link);
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div ref={container} className="relative w-full" style={{ height: "400vh" }}>
      {/* Fixed background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, #0c1424 0%, #05070d 60%, #000 100%)",
        }}
      />

      {/* Placeholder (visible until scene loads) */}
      <div
        className="fixed inset-0 flex items-center justify-center transition-opacity duration-700"
        style={{ opacity: sceneReady ? 0 : 1, pointerEvents: "none" }}
      >
        <div className="text-center">
          <div className="w-40 h-56 mx-auto rounded-md bg-gradient-to-br from-[#3a1f10] to-[#1a0d05] shadow-2xl border border-[#5a3520]/60 flex items-center justify-center">
            <Bookmark className="text-amber-300/80 animate-pulse" size={36} />
          </div>
          <p className="mt-6 text-white/40 text-sm tracking-wider uppercase">
            Loading
          </p>
        </div>
      </div>

      {/* Fixed 3D canvas */}
      <div
        className="fixed inset-0 transition-opacity duration-1000"
        style={{ opacity: sceneReady ? 1 : 0 }}
      >
        <Canvas
          camera={{ position: [0, 0.6, 4.2], fov: 50 }}
          dpr={[1, 2]}
          onCreated={() => setTimeout(() => setSceneReady(true), 200)}
        >
          <Suspense fallback={null}>
            <Scene progress={scrollYProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll-tracked overlay content */}
      <div className="relative pointer-events-none">
        {/* Hero copy */}
        <section className="h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-center max-w-2xl"
          >
            <p className="text-white/40 text-sm tracking-[0.3em] uppercase mb-4">
              An EdTech experiment
            </p>
            <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[1.05]">
              The book that learns <span className="italic text-amber-200/90">you</span>.
            </h1>
            <p className="mt-6 text-white/60 text-lg">
              Scroll to begin the story.
            </p>
          </motion.div>
        </section>

        {/* Card stages — each card lives in its own viewport-tall section */}
        {QUOTES.map((q, i) => {
          const start = 0.15 + i * 0.18;
          const range: [number, number, number, number] = [
            start,
            start + 0.05,
            start + 0.1,
            start + 0.16,
          ];
          return (
            <section key={i} className="h-screen relative">
              <TornCard
                text={q}
                progress={scrollYProgress}
                range={range}
                style={CARD_POSITIONS[i]}
              />
            </section>
          );
        })}

        {/* Form */}
        <section className="h-screen flex items-center justify-center">
          <WaitlistForm progress={scrollYProgress} />
        </section>
      </div>
    </div>
  );
}
