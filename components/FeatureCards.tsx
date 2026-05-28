"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Share2, Heart, Brain, Shield } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Organization",
      description:
        "Turn chaotic study materials into structured, easy-to-follow learning paths. Our smart categorization system automatically organizes your notes, practice problems, and resources.",
      benefit: "Save 10+ hours per week",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart Progress Tracking",
      description:
        "See exactly what you need to focus on to improve your grades efficiently. Our AI-powered analytics identify your weak areas and suggest targeted study plans.",
      benefit: "Improve grades by 20-30%",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Collaborative Learning",
      description:
        "Refer friends and grow together - the more you share, the better you all do. Our referral system rewards you for helping others succeed.",
      benefit: "Build a stronger network",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Mental Wellness",
      description:
        "Reduce study-related stress and anxiety with our balanced approach to learning. We promote sustainable study habits that prevent burnout.",
      benefit: "Lower stress levels by 40%",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Knowledge Retention",
      description:
        "Remember what you learn longer with our spaced repetition system. We help you review material at optimal intervals for maximum retention.",
      benefit: "Increase retention by 50%",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Security",
      description:
        "Your data is protected with enterprise-grade encryption and privacy controls. We never sell your information or use it for advertising.",
      benefit: "Peace of mind",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-all duration-500" />

          <div className="flex h-12 w-12 items-center justify-center bg-[#D4AF37]/10 rounded-xl mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
            <div className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
          </div>

          <h3 className="font-heading text-xl mb-3 text-white group-hover:text-[#D4AF37] transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {feature.description}
          </p>

          <div className="mt-auto flex items-center space-x-2 text-sm">
            <div className="h-1 w-1 bg-[#D4AF37] rounded-full group-hover:w-4 transition-all duration-300" />
            <span className="font-semibold text-[#D4AF37]">
              {feature.benefit}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
