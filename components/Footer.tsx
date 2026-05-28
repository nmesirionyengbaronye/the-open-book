"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "support@uniui.com";
  const WHATSAPP_URL =
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://whatsapp.com/group";

  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading text-[#D4AF37]">Uni UI</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              University Uploaded Intelligence - A study organization platform
              built by students, for students.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-[#D4AF37] text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {[
                { label: "Join Waitlist", href: "/join" },
                { label: "Retrieve Link", href: "/retrieve" },
                { label: "Leaderboard", href: "/leaderboard" },
                { label: "Status", href: "/status" },
                { label: "Milestones", href: "/milestones" },
                { label: "About Us", href: "/about" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-heading text-[#D4AF37] text-sm tracking-wider uppercase">
              Connect
            </h4>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm flex items-center">
                <span className="mr-2">📍</span> Built with ❤️ in Owerri,
                Nigeria
              </p>
              <div className="flex flex-col space-y-3 pt-2">
                <motion.a
                  whileHover={{ x: 5 }}
                  href={`mailto:${EMAIL}`}
                  className="text-gray-300 hover:text-[#D4AF37] text-sm flex items-center transition-colors"
                >
                  <span className="mr-2">✉️</span> {EMAIL}
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    window.open(WHATSAPP_URL, "_blank", "noopener")
                  }
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
                >
                  <span>Join WhatsApp Community</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Uni UI. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
