import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Bookmark,
  Sparkles,
  BrainCircuit,
  Lightbulb,
  Upload,
  Wand2,
  GraduationCap,
} from "lucide-react";
import * as THREE from "three";

/* ============================================================
   THEME
   ============================================================ */
const GOLD = "#D4AF37";
const GOLD_SOFT = "#E8C766";
const CREAM = "#f5f0e6";
const LEATHER = "#2c1b0d";
const BG = "#0a0a0a";

const SPRING = { mass: 0.8, stiffness: 80, damping: 20 };

/* ============================================================
   PAGE TEXTURES
   ============================================================ */
const PAGE_COUNT = 20;

const PAGE_CONTENT: string[][] = [
  ["E = mc²", "", "Mass–energy", "equivalence.", "Einstein, 1905"],
  ["History — 1914", "", "Sarajevo.", "Archduke shot.", "Europe ignites."],
  ["DNA Replication", "", "Helicase unwinds.", "Polymerase builds.", "5' → 3'"],
  ["∫ x dx", "  = x²/2 + C", "", "Integration", "by parts:", "∫u dv = uv − ∫v du"],
  ["Photosynthesis", "", "6CO₂ + 6H₂O", "  → C₆H₁₂O₆", "  + 6O₂"],
  ["Pythagoras", "", "a² + b² = c²", "Right triangles.", "Greek, ~500 BC"],
  ["Newton II", "", "F = m · a", "", "Force = mass", "× acceleration"],
  ["Periodic Table", "", "H  He", "Li Be B C N O", "F Ne Na Mg"],
  ["Macbeth", "", "\"Out, out,", "brief candle.\"", "— Act V, Sc. V"],
  ["for i in range(n):", "    total += i", "", "# O(n) time", "# O(1) space"],
  ["Supply & Demand", "", "Price ↑ → Qty ↓", "Price ↓ → Qty ↑", "Equilibrium."],
  ["Cell Mitosis", "", "Prophase", "Metaphase", "Anaphase", "Telophase"],
  ["Ohm's Law", "", "V = I · R", "", "Volts = Amps", "× Ohms"],
  ["French", "", "je suis", "tu es", "il / elle est", "nous sommes"],
  ["Plate Tectonics", "", "Convergent.", "Divergent.", "Transform."],
  ["The Renaissance", "", "1300 — 1600", "Florence.", "Humanism rises."],
  ["Quadratic", "", "x = (−b ±", "  √(b²−4ac))", "  / 2a"],
  ["Bayes' Theorem", "", "P(A|B) =", "P(B|A)·P(A)", "  / P(B)"],
  ["Trigonometry", "", "sin² + cos² = 1", "tan = sin/cos", ""],
  ["Bill of Rights", "", "1791.", "Ten amendments.", "Freedom of speech."],
];

function makePageTexture(lines: string[]): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // paper
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, 512, 512);
  // subtle vignette
  const grad = ctx.createRadialGradient(256, 256, 100, 256, 256, 360);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(60,40,10,0.18)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // ruled lines
  ctx.strokeStyle = "rgba(70,50,20,0.10)";
  ctx.lineWidth = 1;
  for (let y = 70; y < 500; y += 30) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(482, y);
    ctx.stroke();
  }

  // margin line
  ctx.strokeStyle = "rgba(180,40,40,0.25)";
  ctx.beginPath();
  ctx.moveTo(70, 30);
  ctx.lineTo(70, 482);
  ctx.stroke();

  // text
  ctx.fillStyle = "#1b1208";
  ctx.font = "bold 28px Georgia, 'Times New Roman', serif";
  lines.forEach((l, i) => {
    if (l) ctx.fillText(l, 90, 90 + i * 42);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/* ============================================================
   SCATTER TARGETS
   ============================================================ */
type Scatter = { pos: [number, number, number]; rot: [number, number, number] };

function useScatterTargets(radius: number): Scatter[] {
  return useMemo(() => {
    const arr: Scatter[] = [];
    for (let i = 0; i < PAGE_COUNT; i++) {
      const r = radius * (0.55 + Math.random() * 0.45);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.7,
          r * Math.cos(phi) * 0.8,
        ],
        rot: [
          (Math.random() - 0.5) * Math.PI,
          (Math.random() - 0.5) * Math.PI,
          (Math.random() - 0.5) * Math.PI,
        ],
      });
    }
    return arr;
  }, [radius]);
}

/* ============================================================
   SCROLL → DECONSTRUCTION CURVE
   ============================================================ */
// 0→0.3 scatter, 0.3→0.5 hold, 0.5→1 reassemble. Returns 0..1 "openness".
const OPEN_INPUT = [0, 0.3, 0.5, 1];
const OPEN_OUTPUT = [0, 1, 1, 0];

/* ============================================================
   3D PARTS
   ============================================================ */
function Page({
  index,
  openness,
  scatter,
  texture,
}: {
  index: number;
  openness: MotionValue<number>;
  scatter: Scatter;
  texture: THREE.CanvasTexture;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const closedY = -0.22 + (index / PAGE_COUNT) * 0.44;

  useFrame((state) => {
    const t = openness.get();
    const breath = Math.sin(state.clock.elapsedTime * 0.7 + index * 0.4) * 0.04 * (1 - t);

    ref.current.position.x = scatter.pos[0] * t;
    ref.current.position.y = closedY + scatter.pos[1] * t + breath;
    ref.current.position.z = scatter.pos[2] * t;
    ref.current.rotation.x = scatter.rot[0] * t;
    ref.current.rotation.y = scatter.rot[1] * t;
    ref.current.rotation.z = scatter.rot[2] * t;
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1.55, 0.012, 1.05]} />
      <meshStandardMaterial map={texture} roughness={0.92} metalness={0.04} />
    </mesh>
  );
}

function GoldFoilEdge({
  size,
  y,
}: {
  size: [number, number, number];
  y: number;
}) {
  // Thin gold frame on top of cover
  const [w, , d] = size;
  const t = 0.04;
  const off = 0.26;
  return (
    <group position={[0, y, 0]}>
      {[
        [0, 0, d / 2 - t / 2] as [number, number, number],
        [0, 0, -d / 2 + t / 2] as [number, number, number],
      ].map((p, i) => (
        <mesh key={`h${i}`} position={p}>
          <boxGeometry args={[w - off, 0.012, t]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.05} />
        </mesh>
      ))}
      {[
        [w / 2 - t / 2, 0, 0] as [number, number, number],
        [-w / 2 + t / 2, 0, 0] as [number, number, number],
      ].map((p, i) => (
        <mesh key={`v${i}`} position={p}>
          <boxGeometry args={[t, 0.012, d - off]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function Cover({
  side,
  openness,
}: {
  side: "left" | "right";
  openness: MotionValue<number>;
}) {
  const ref = useRef<THREE.Group>(null!);
  const sign = side === "left" ? -1 : 1;

  useFrame(() => {
    const t = openness.get();
    ref.current.position.x = sign * t * 2.4;
    ref.current.position.y = t * 0.2;
    ref.current.rotation.z = sign * t * 0.45;
    ref.current.rotation.y = sign * t * -0.55;
  });

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.08, 1.1]} />
        <meshStandardMaterial color={LEATHER} metalness={0.2} roughness={0.9} />
      </mesh>
      <GoldFoilEdge size={[1.6, 0.08, 1.1]} y={0.045} />
      {/* Central gold emblem */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.012, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} emissive={GOLD} emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}

function Spine({ openness }: { openness: MotionValue<number> }) {
  const ref = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(() => {
    const t = openness.get();
    ref.current.position.y = -t * 2;
    matRef.current.opacity = 1 - t;
    matRef.current.transparent = true;
  });

  return (
    <group ref={ref} position={[0, 0, -0.55]}>
      <mesh>
        <boxGeometry args={[1.6, 0.5, 0.1]} />
        <meshStandardMaterial
          ref={matRef}
          color="#1d1108"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
      {/* gold horizontal bands */}
      {[0.18, 0, -0.18].map((y, i) => (
        <mesh key={i} position={[0, y, 0.051]}>
          <boxGeometry args={[1.55, 0.02, 0.005]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} emissive={GOLD} emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function BookGroup({
  openness,
  scatterRadius,
}: {
  openness: MotionValue<number>;
  scatterRadius: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const scatter = useScatterTargets(scatterRadius);

  const textures = useMemo(
    () => Array.from({ length: PAGE_COUNT }, (_, i) => makePageTexture(PAGE_CONTENT[i % PAGE_CONTENT.length])),
    [],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const breath = 1 + Math.sin(t * 0.8) * 0.02;
    group.current.scale.setScalar(breath);
    group.current.position.y = Math.sin(t * 0.5) * 0.05;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.18;
  });

  return (
    <group ref={group}>
      <Cover side="left" openness={openness} />
      <Cover side="right" openness={openness} />
      <Spine openness={openness} />
      {scatter.map((s, i) => (
        <Page key={i} index={i} openness={openness} scatter={s} texture={textures[i]} />
      ))}
    </group>
  );
}

function GoldDust() {
  const ref = useRef<THREE.Points>(null!);
  const { geometry, count } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const c = 260;
    const arr = new Float32Array(c * 3);
    for (let i = 0; i < c; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return { geometry: g, count: c };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.02;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const yi = i * 3 + 1;
      pos.array[yi] = (pos.array[yi] as number) + Math.sin(t + i) * 0.0008;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color={GOLD}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene({
  openness,
  scatterRadius,
}: {
  openness: MotionValue<number>;
  scatterRadius: number;
}) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 7, 20]} />
      <ambientLight intensity={0.45} color="#3a3a3a" />
      <pointLight position={[4, 5, 4]} intensity={1.8} color="#ffd4a3" />
      <pointLight position={[-5, -2, 3]} intensity={0.5} color={GOLD} />
      <GoldDust />
      <BookGroup openness={openness} scatterRadius={scatterRadius} />
    </>
  );
}

/* ============================================================
   TORN GLASS QUOTE CARD
   ============================================================ */
const TORN_CLIP =
  "polygon(2% 6%, 12% 0%, 38% 4%, 62% 0%, 88% 5%, 100% 12%, 96% 38%, 100% 64%, 97% 90%, 84% 100%, 56% 96%, 30% 100%, 8% 95%, 0% 78%, 4% 50%, 0% 22%)";

function TornCard({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`p-7 md:p-8 max-w-xs md:max-w-sm ${className}`}
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.18)",
        clipPath: TORN_CLIP,
        boxShadow: "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.15)",
        ...style,
      }}
    >
      <p
        style={{ fontFamily: "'Caveat', cursive", color: GOLD_SOFT }}
        className="text-2xl md:text-3xl leading-snug"
      >
        {text}
      </p>
    </div>
  );
}

function ScrollTornCard({
  text,
  progress,
  range,
  positionClass,
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  positionClass: string;
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [50, 0, 0, -40]);
  const rotate = useTransform(progress, [range[0], range[3]], [-6, 6]);
  return (
    <motion.div
      style={{ opacity, y, rotate }}
      className={`absolute pointer-events-none ${positionClass}`}
    >
      <TornCard text={text} />
    </motion.div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Smooth, springy scroll progress
  const smoothProgress = useSpring(scrollYProgress, SPRING);
  const openness = useTransform(smoothProgress, OPEN_INPUT, OPEN_OUTPUT);

  // Hero fades out as you exit the book section
  const heroOpacity = useTransform(smoothProgress, [0.88, 1], [1, 0]);

  const [sceneReady, setSceneReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Caveat font + smooth scroll
  useEffect(() => {
    const id = "caveat-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap";
      document.head.appendChild(link);
    }
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  const scatterRadius = isMobile ? 2.4 : 4;

  return (
    <main style={{ background: BG }} className="text-white min-h-screen">
      {/* =================== HERO (sticky 3D) =================== */}
      <section ref={heroRef} className="relative" style={{ height: "400vh" }}>
        {/* Fixed visual stack */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          {/* radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 45%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 30%, rgba(10,10,10,0) 70%)",
            }}
          />

          {/* Placeholder while 3D loads */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
            style={{ opacity: sceneReady ? 0 : 1, pointerEvents: "none" }}
          >
            <div className="text-center">
              <svg width="120" height="160" viewBox="0 0 120 160" className="mx-auto drop-shadow-[0_10px_40px_rgba(212,175,55,0.25)]">
                <rect x="6" y="6" width="108" height="148" rx="4" fill={LEATHER} stroke={GOLD} strokeWidth="1.5" />
                <rect x="14" y="14" width="92" height="132" rx="2" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.7" />
                <circle cx="60" cy="80" r="14" fill="none" stroke={GOLD} strokeWidth="1.5" />
                <path d="M60 70 L60 90 M50 80 L70 80" stroke={GOLD} strokeWidth="1.2" />
              </svg>
              <div className="mt-5 flex items-center justify-center gap-2 text-[color:var(--gold)]" style={{ color: GOLD }}>
                <Bookmark size={16} className="animate-pulse" />
                <span className="text-xs tracking-[0.3em] uppercase">Loading</span>
              </div>
            </div>
          </div>

          {/* 3D canvas */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: sceneReady ? 1 : 0 }}
          >
            <Canvas
              camera={{ position: [0, 0.6, 4.5], fov: 50 }}
              dpr={[1, 2]}
              onCreated={() => setTimeout(() => setSceneReady(true), 200)}
            >
              <Suspense fallback={null}>
                <Scene openness={openness} scatterRadius={scatterRadius} />
              </Suspense>
            </Canvas>
          </div>

          {/* Hero copy (visible at the very top) */}
          <motion.div
            style={{ opacity: useTransform(smoothProgress, [0, 0.12], [1, 0]) }}
            className="absolute inset-x-0 top-[12vh] md:top-[14vh] flex justify-center px-6 pointer-events-none"
          >
            <div className="text-center max-w-2xl">
              <p
                className="text-xs md:text-sm tracking-[0.4em] uppercase mb-4"
                style={{ color: GOLD }}
              >
                An EdTech Experiment
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
                The book that learns{" "}
                <span style={{ color: GOLD, fontStyle: "italic" }}>you</span>.
              </h1>
              <p className="mt-5 text-white/55 text-base md:text-lg">
                Scroll to begin the story.
              </p>
            </div>
          </motion.div>

          {/* Scroll-driven quote cards */}
          <ScrollTornCard
            text="I stared at the textbook for three hours. I still don't understand any of it."
            progress={smoothProgress}
            range={[0.18, 0.25, 0.32, 0.4]}
            positionClass="top-[18vh] left-[6%] md:left-[8%]"
          />
          <ScrollTornCard
            text="Everyone else seems to get it. Maybe I'm just not smart enough."
            progress={smoothProgress}
            range={[0.38, 0.45, 0.52, 0.6]}
            positionClass="top-[28vh] right-[6%] md:right-[10%]"
          />
          <ScrollTornCard
            text="One YouTube video, then another. I piece things together. A small light flickers."
            progress={smoothProgress}
            range={[0.5, 0.57, 0.64, 0.72]}
            positionClass="bottom-[22vh] left-[8%] md:left-[12%]"
          />
          <ScrollTornCard
            text="I'm not alone. The right guidance can turn confusion into clarity. This time, I'm ready."
            progress={smoothProgress}
            range={[0.7, 0.77, 0.84, 0.92]}
            positionClass="bottom-[18vh] right-[6%] md:right-[10%]"
          />

          {/* Scroll hint */}
          <motion.div
            style={{ opacity: useTransform(smoothProgress, [0, 0.08], [1, 0]) }}
            className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none"
          >
            <div className="text-white/40 text-xs tracking-[0.3em] uppercase">
              scroll ↓
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* =================== HOW IT WORKS =================== */}
      <Section
        eyebrow="The Method"
        title="How it works"
      >
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Upload, title: "Upload your notes", body: "Drop in messy lecture notes, slides, or screenshots. We meet you where you are." },
            { icon: Wand2, title: "AI deconstructs it", body: "We tear the page apart — concepts, prerequisites, examples — and rebuild it for the way your mind learns." },
            { icon: GraduationCap, title: "Study smarter", body: "Get crystal-clear answers, custom drills, and quiet confidence walking into the exam." },
          ].map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl p-7 bg-white/[0.03] backdrop-blur-sm"
              style={{ border: `1px solid ${GOLD}33` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${GOLD}1a`, border: `1px solid ${GOLD}55` }}
              >
                <Icon size={22} color={GOLD} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: GOLD }}>
                {title}
              </h3>
              <p className="text-white/65 leading-relaxed text-sm">{body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* =================== WHY JOIN =================== */}
      <Section eyebrow="The Promise" title="Why join?">
        <div className="grid md:grid-cols-3 gap-10 mt-12">
          {[
            { icon: BrainCircuit, title: "Built for confusion", body: "Designed for the moment after the lecture ended — when nothing made sense and the deadline is tomorrow." },
            { icon: Lightbulb, title: "Clarity, not noise", body: "No 40-tab YouTube spirals. One quiet guide, focused on you." },
            { icon: Sparkles, title: "You, but unstuck", body: "A version of you that walks into the room knowing it cold. We're building toward that." },
          ].map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center px-2"
            >
              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-5"
                style={{ background: `${GOLD}14`, border: `1px solid ${GOLD}55` }}
              >
                <Icon size={26} color={GOLD} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
              <p className="text-white/60 leading-relaxed text-sm max-w-xs mx-auto">{body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* =================== THE JOURNEY =================== */}
      <Section eyebrow="The Arc" title="The journey">
        <div className="grid md:grid-cols-2 gap-10 mt-12 place-items-center">
          {[
            "I stared at the textbook for three hours. I still don't understand any of it.",
            "Everyone else seems to get it. Maybe I'm just not smart enough.",
            "One YouTube video, then another. I piece things together. A small light flickers.",
            "I'm not alone. The right guidance can turn confusion into clarity. This time, I'm ready.",
          ].map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 4 : -4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
            >
              <TornCard text={q} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* =================== WAITLIST =================== */}
      <WaitlistSection />

      <footer className="py-10 text-center text-white/30 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} · Built with care
      </footer>
    </main>
  );
}

/* ============================================================
   SECTION WRAPPER
   ============================================================ */
function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: GOLD }}
          >
            {eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            {title}
          </h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

/* ============================================================
   WAITLIST FORM
   ============================================================ */
function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative py-32 md:py-40 px-6">
      {/* glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.10) 0%, rgba(10,10,10,0) 65%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative max-w-xl mx-auto text-center"
      >
        <p
          className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: GOLD }}
        >
          You're early
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Join the Waitlist
        </h2>
        <p className="mt-5 text-white/60">
          Learning shouldn't feel like drowning. Be first when we open the doors.
        </p>

        <div className="mt-10">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl px-6 py-8 backdrop-blur-xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${GOLD}55`,
                boxShadow: "0 20px 60px rgba(212,175,55,0.15)",
              }}
            >
              <p className="text-lg" style={{ color: GOLD }}>
                You're in.
              </p>
              <p className="text-white/60 text-sm mt-2">
                We'll write the moment the doors open.
              </p>
            </motion.div>
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
                className="flex-1 rounded-full bg-white/[0.06] backdrop-blur-xl px-6 py-4 text-white placeholder-white/40 outline-none transition focus:bg-white/[0.1]"
                style={{ border: `1px solid ${GOLD}44` }}
              />
              <button
                type="submit"
                className="rounded-full px-7 py-4 font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(180deg, ${GOLD_SOFT} 0%, ${GOLD} 100%)`,
                  boxShadow: "0 10px 30px rgba(212,175,55,0.35)",
                }}
              >
                I Relate
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
