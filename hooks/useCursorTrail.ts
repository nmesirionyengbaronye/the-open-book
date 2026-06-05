'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  createdAt: number;
}

/**
 * useCursorTrail Hook
 * 
 * Tracks mouse movement within a container and manages a set of "particles" for a visual trail.
 * Includes throttling and efficient state updates to maintain performance.
 */
export default function useCursorTrail(limit = 20, ttl = 1000) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const now = Date.now();
    // Throttle particle creation to ~60fps (16ms)
    if (now - lastUpdateRef.current < 16) return;
    lastUpdateRef.current = now;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle: Particle = {
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
      createdAt: now,
    };

    setParticles((prev) => {
      const filtered = prev.filter((p) => now - p.createdAt < ttl);
      const combined = [...filtered, newParticle];
      return combined.length > limit ? combined.slice(combined.length - limit) : combined;
    });
  }, [limit, ttl]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    node.addEventListener('mousemove', handleMouseMove);
    return () => node.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Periodic cleanup for stale particles when mouse is not moving
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setParticles((prev) => {
        const active = prev.filter((p) => now - p.createdAt < ttl);
        return active.length === prev.length ? prev : active;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [ttl]);

  return { particles, containerRef };
}
