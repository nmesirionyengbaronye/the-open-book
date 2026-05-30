'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function useCursorTrail() {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; createdAt: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setParticles((prev) => [...prev, { x, y, createdAt: Date.now() }]);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const node = containerRef.current;
    node.addEventListener('mousemove', handleMouseMove);
    return () => node.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.createdAt < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return { particles, containerRef };
}