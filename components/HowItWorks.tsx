"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserPlus, Share2, Unlock, Users } from "lucide-react";

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "01",
      title: "Join the Waitlist",
      description:
        "Sign up with your details to get early access to Uni UI. Provide your full name, WhatsApp number, and academic information.",
      icon: <UserPlus className="w-6 h-6" />,
    },
    {
      number: "02",
      title: "Get Your Referral Code",
      description:
        "Receive a unique code to share with friends and move up the waitlist. Each referral advances you 3 positions.",
      icon: <Share2 className="w-6 h-6" />,
    },
    {
      number: "03",
      title: "Access Premium Tools",
      description:
        "Unlock organized study tools, progress tracking, and collaborative learning features designed for students.",
      icon: <Unlock className="w-6 h-6" />,
    },
    {
      number: "04",
      title: "Succeed Together",
      description:
        "Study smarter with friends and achieve your academic goals faster through community-driven learning.",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".step-card").forEach((card: any, index: number) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Animate connection line
        if (index < steps.length - 1) {
          const line = card.querySelector(".connection-line");
          if (line) {
            gsap.fromTo(
              line,
              { width: "0%" },
              {
                width: "100%",
                duration: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-16">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.number} className="relative step-card">
            {/* Step content */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full flex flex-col items-center text-center group hover:border-[#D4AF37]/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] transition-all duration-500">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-[calc(100%-20px)] w-full h-[1px] bg-gradient-to-r from-[#D4AF37]/50 to-transparent z-0 connection-line pointer-events-none" />
              )}

              {/* Step number */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[#D4AF37] font-bold text-xl group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
                  {step.number}
                </div>
              </div>

              {/* Step icon */}
              <div className="mb-6 p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>

              {/* Step title */}
              <h3 className="font-heading text-lg mb-4 text-white group-hover:text-[#D4AF37] transition-colors">
                {step.title}
              </h3>

              {/* Step description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
