"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const PANTERO_URL =
  process.env.NEXT_PUBLIC_PANTERO_URL || "https://pantero.vercel.app";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/join", label: "Join" },
    { href: "/retrieve", label: "Retrieve" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/status", label: "Status" },
    { href: "/milestones", label: "Milestones" },
  ];

  return (
    <nav className="bg-[#13131A]/60 backdrop-blur-xl border-b border-white/10 fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl font-heading text-[#D4AF37] tracking-tight"
              >
                Uni UI
              </motion.span>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-sm font-medium text-gray-400 hover:text-[#D4AF37] transition-colors group"
                >
                  {link.label}
                  {pathname === link.href ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-[#D4AF37]"
                    />
                  ) : (
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <motion.a
              href={PANTERO_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 text-sm font-medium text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg hover:bg-[#D4AF37]/10 transition-all flex items-center space-x-1"
            >
              <span>Pantero</span>
              <span className="text-xs">↗</span>
            </motion.a>
          </div>
        </div>
      </div>
    </nav>
  );
}
