"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [pageTextures, setPageTextures] = useState<THREE.CanvasTexture[]>([]);

  // Generate page textures with textbook content
  useEffect(() => {
    const pageCount = 30;
    const contentLines = [
      "F = ma",
      "E = mc²",
      "V = IR",
      "PV = nRT",
      "∇·E = ρ/ε₀",
      "∇×B = μ₀J + μ₀ε₀∂E/∂t",
      "∮E·dΦ = -dΦB/dt",
      "δQ = dU + δW",
      "∫F·dx = ΔK",
      "∑F = 0",
      "∑M = 0",
      "σ = F/A",
      "ε = ΔL/L",
      "I = Vr/Rt",
      "Q = It",
      "C = Q/V",
      "τ = RC",
      "f = 1/T",
      "ω = 2πf",
      "v = fλ",
      "n₁sinθ₁ = n₂sinθ₂",
      "1/f = 1/u + 1/v",
      "E = hf",
      "p = h/λ",
      "ΔE = hf",
      "T = 2π√(L/g)",
      "P = IV",
      "Q = CV",
      "τ = Iα",
    ];

    const textures: THREE.CanvasTexture[] = [];
    for (let i = 0; i < pageCount; i++) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = 512;
      canvas.height = 256;

      // Background
      ctx.fillStyle = "#f8f4e3";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text
      ctx.fillStyle = "#5d4037";
      ctx.font = "bold 20px Space Grotesk";
      ctx.textAlign = "center";

      const line1 = contentLines[i % contentLines.length];
      const line2 = `Problem Set ${i + 1}`;
      const line3 = `Due: ${2024 + Math.floor(i / 5)}-${(i % 12) + 1}-${10 + (i % 20)}`;

      ctx.fillText(line1, canvas.width / 2, 60);
      ctx.fillText(line2, canvas.width / 2, 120);
      ctx.fillText(line3, canvas.width / 2, 180);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      textures.push(texture);
    }
    setPageTextures(textures);
  }, []);

  const width = 4;
  const height = 6;
  const depth = 0.5;

  return (
    <>
      {/* 3D Canvas */}
      <div className="fixed inset-0 pointer-events-none">
        <Canvas
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          camera={{ position: [0, 2, 8], fov: 45 }}
        >
          {/* Lights */}
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 10, 7]} intensity={0.6} color={0xffd700} />

          {/* Book Group */}
          <group>
            {/* Left Cover */}
            <mesh position={[-2.2, 0, 0]}>
              <boxGeometry args={[width * 0.9, height, depth * 0.2]} />
              <meshStandardMaterial
                color={0x13131a}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>

            {/* Right Cover */}
            <mesh position={[2.2, 0, 0]}>
              <boxGeometry args={[width * 0.9, height, depth * 0.2]} />
              <meshStandardMaterial
                color={0x13131a}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>

            {/* Spine */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[depth * 0.2, height * 0.9, depth]} />
              <meshStandardMaterial
                color={0x13131a}
                metalness={0.4}
                roughness={0.5}
              />
            </mesh>

            {/* Pages */}
            {pageTextures.map((texture, i) => (
              <mesh
                key={i}
                position={[(i - 15) * 0.02, 0, -depth / 2 + i * (depth / 30)]}
              >
                <planeGeometry args={[width * 0.85, height * 0.85]} />
                <meshStandardMaterial
                  map={texture}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.9}
                  metalness={0.1}
                  roughness={0.8}
                />
              </mesh>
            ))}
          </group>
        </Canvas>
      </div>

      {/* Torn paper quote cards */}
      <div className="absolute inset-0 flex items-start justify-start p-8">
        <div className="space-y-6">
          {[
            {
              text: "The beautiful thing about learning is that nobody can take it away from you.",
              author: "B.B. King",
            },
            {
              text: "Education is the most powerful weapon which you can use to change the world.",
              author: "Nelson Mandela",
            },
            {
              text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
              author: "Dr. Seuss",
            },
            {
              text: "Develop a passion for learning. If you do, you will never cease to grow.",
              author: "Anthony J. D'Angelo",
            },
          ].map((quote, i) => (
            <motion.div
              key={i}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
              className={`w-[240px] max-w-xs rotate-${-3 + i * 2}`}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 relative group hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:border-[#D4AF37]/40 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{quote.text}"
                </p>
                <p className="text-xs text-[#D4AF37] mt-3 font-medium">
                  — {quote.author}
                </p>

                {/* Subtle gold accent in corner */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#D4AF37]/10 rounded-full blur-xl group-hover:bg-[#D4AF37]/30 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
