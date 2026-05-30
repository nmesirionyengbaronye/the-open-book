'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";

const LINKS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "join", label: "Join" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "status", label: "Status" },
  { id: "milestones", label: "Milestones" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? "glass-strong border-b border-gold/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-bright grid place-items-center gold-glow">
            <Shield className="w-5 h-5 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg tracking-tight">
            uni <span className="text-gold">ui</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-gold transition-colors rounded-md"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("join")}
            className="ml-3 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold gold-glow-hover"
          >
            Join Waitlist
          </button>
        </nav>

        <button className="md:hidden p-2 text-gold" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-strong border-t border-gold/15"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="text-left px-3 py-3 text-foreground/80 hover:text-gold border-b border-white/5"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("join")}
                className="mt-3 px-4 py-3 rounded-lg bg-gold text-background font-semibold"
              >
                Join Waitlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
