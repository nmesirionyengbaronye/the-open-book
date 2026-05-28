"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      name: "Adaobi N.",
      institution: "FUTO",
      course: "Computer Engineering",
      text: "Uni UI cut my study time in half. I finally understand topics that used to take me days to grasp. The way it organizes my lecture notes and practice problems has transformed how I approach my coursework.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Chinedu O.",
      institution: "UNN",
      course: "Electrical Engineering",
      text: "The referral system motivated me to share with my classmates. Now we're all succeeding together. I've referred 5 friends and moved up 15 positions in the waitlist. It's amazing how helping others helps you too.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Zainab A.",
      institution: "FUTO",
      course: "Petroleum Engineering",
      text: "As a working student, Uni UI's organized approach helped me balance work and studies effectively. I can quickly find what I need for each course without wasting time searching through disorganized files.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextStep();
    }, 8000);
    return () => clearInterval(interval);
  }, [index]);

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="relative max-w-4xl mx-auto min-h-[400px] flex items-center justify-center overflow-hidden py-10 px-4">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 relative group"
        >
          {/* Decorative quote icon */}
          <div className="absolute top-8 right-10 text-[#D4AF37]/20">
            <Quote size={80} strokeWidth={1} />
          </div>

          <div className="relative z-10 space-y-8">
            <p className="text-xl md:text-2xl font-heading text-white italic leading-relaxed text-center md:text-left">
              "{testimonials[index].text}"
            </p>

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pt-4 border-t border-white/10">
              <div className="relative">
                <div className="absolute inset-0 bg-[#D4AF37] blur-md opacity-20 rounded-full" />
                <img
                  src={testimonials[index].avatar}
                  alt={testimonials[index].name}
                  className="relative h-16 w-16 rounded-full border-2 border-[#D4AF37] object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-lg font-bold text-[#D4AF37]">
                  {testimonials[index].name}
                </h4>
                <p className="text-sm text-gray-400">
                  {testimonials[index].institution} •{" "}
                  {testimonials[index].course}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-20">
        <button
          onClick={prevStep}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#D4AF37] hover:text-black hover:scale-110 transition-all"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-2 transition-all duration-300 rounded-full ${i === index ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/20"}`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#D4AF37] hover:text-black hover:scale-110 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
