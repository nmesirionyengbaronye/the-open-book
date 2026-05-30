'use client';

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppBubble() {
  return (
    <motion.a
      href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/uniui-community"} target="_blank" rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
      className="fixed bottom-5 right-5 z-40"
      aria-label="WhatsApp community"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-bright grid place-items-center gold-glow"
      >
        <MessageCircle className="w-6 h-6 text-background" strokeWidth={2.5} />
      </motion.div>
      <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping -z-10" />
    </motion.a>
  );
}
