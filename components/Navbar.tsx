'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { id: "hero", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "blog", label: "Blog", path: "/blog" },
  { id: "creators", label: "Creators", path: "/creators" },
  { id: "join", label: "Join", path: "/join" },
  { id: "leaderboard", label: "Leaderboard", path: "/leaderboard" },
  { id: "status", label: "Status", path: "/status" },
  { id: "milestones", label: "Milestones", path: "/milestones" },
  { id: "winners", label: "Winners", path: "/winners" },
  { id: "feedback", label: "Feedback", path: "/feedback" },
  { id: "referral", label: "Referrals", path: "/referral" },
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
      scrollTo(id);
    } else {
      router.push(path);
      setOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? "glass-strong border-b border-black/20" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button onClick={() => handleLinkClick("/", "hero")} className="flex items-center gap-2.5 group">
          <img
            src="/mascots/cat.svg"
            alt="Uni UI mascot"
            width={32}
            height={32}
            className="h-8 w-auto rounded-md"
          />
          <img
            src="/logo.png"
            alt="Uni UI"
            width={64}
            height={36}
            className="h-7 w-auto rounded-md ring-1 ring-black/20 group-hover:ring-black/50 transition"
          />
          <span className="font-display text-lg tracking-tight text-black">
            UNI <span className="text-black">UI</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLinkClick("/join")}
            className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-[#FFD93D] text-black text-sm font-semibold"
          >
            Join Waitlist
          </button>
          <button className="p-2 text-black" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden glass-strong border-b border-black/15"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLinkClick(l.path, l.id)}
                  className={`px-3 py-2 text-sm text-black/60 hover:text-black transition-colors rounded-md ${pathname === l.path ? 'text-black bg-black/10' : ''}`}
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => handleLinkClick("/join")}
                className="sm:hidden mt-3 px-4 py-3 rounded-lg bg-[#FFD93D] text-black font-semibold"
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
