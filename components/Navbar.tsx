'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { id: "hero", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "join", label: "Join", path: "/join" },
  { id: "leaderboard", label: "Leaderboard", path: "/leaderboard" },
  { id: "status", label: "Status", path: "/status" },
  { id: "milestones", label: "Milestones", path: "/milestones" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLinkClick = (path: string, id?: string) => {
    if (path === pathname && id) {
      // Already on the page, scroll to section
      scrollTo(id);
    } else {
      // Navigate to the page
      router.push(path);
      setOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? "glass-strong border-b border-gold/20" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button onClick={() => handleLinkClick("/", "hero")} className="flex items-center gap-2 group">
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
              onClick={() => handleLinkClick(l.path, l.id)}
              className={`px-3 py-2 text-sm text-muted-foreground hover:text-gold transition-colors rounded-md ${pathname === l.path ? 'text-gold bg-gold/10' : ''}`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleLinkClick("/join")}
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
                  onClick={() => handleLinkClick(l.path, l.id)}
                  className={`px-3 py-2 text-sm text-muted-foreground hover:text-gold transition-colors rounded-md ${pathname === l.path ? 'text-gold bg-gold/10' : ''}`}
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => handleLinkClick("/join")}
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
