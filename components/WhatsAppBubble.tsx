"use client";

import { motion } from "framer-motion";

export default function WhatsAppBubble() {
  const WHATSAPP_URL =
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://whatsapp.com/group";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-[100]"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center h-14 w-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full animate-ping bg-[#D4AF37]/20 scale-125" />

        <span className="relative text-2xl group-hover:scale-110 transition-transform duration-300">
          💬
        </span>
      </a>

      {/* Label on hover */}
      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg text-xs font-medium text-[#D4AF37] whitespace-nowrap shadow-xl">
          Join Community
        </div>
      </div>
    </motion.div>
  );
}
