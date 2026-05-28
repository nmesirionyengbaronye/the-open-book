"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppBubble from "@/components/WhatsAppBubble";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FeatureCards from "@/components/FeatureCards";
import HowItWorks from "@/components/HowItWorks";
import FAQAccordion from "@/components/FAQAccordion";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HeroSection = dynamic(() => import("@/components/HeroSection"), {
  ssr: false,
});

const PANTERO_URL =
  process.env.NEXT_PUBLIC_PANTERO_URL || "https://pantero.vercel.app";

export default function HomePage() {
  // Register GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <>
      <Navbar />
      {/* Hero Section with 3D Book */}
      <HeroSection />

      <main className="relative z-10">
        {/* What is Uni UI? */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1, transition: { duration: 0.8 } }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <section
            id="what-is-uniui"
            className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading text-[#D4AF37] mb-6">
                What is Uni UI?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                A study organization platform built by an engineering student,
                for engineering students
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-heading text-[#D4AF37] mb-6">
                  More Than Just Another Study App
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Uni UI is a comprehensive study organization system designed
                  specifically for the unique challenges engineering students
                  face. Unlike generic note-taking apps, we understand the
                  complexity of engineering coursework - from intricate
                  mathematical derivations to complex circuit diagrams and
                  programming assignments.
                </p>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Our platform combines intelligent organization with social
                  accountability. The more you help others succeed through our
                  referral system, the faster you progress through our waitlist
                  to access premium features that make studying more efficient
                  and effective.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Built from personal frustration with disorganized study
                  materials, Uni UI represents the solution I wished I had
                  during my sophomore year when I was struggling to keep up with
                  demanding coursework.
                </p>
              </div>

              <div className="flex justify-center">
                <div className="w-full h-96 bg-[#13131A]/50 rounded-xl border border-[#D4AF37]/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/10"></div>
                  <div
                    key="hero-content"
                    className="relative z-10 text-center space-y-4"
                  >
                    <div className="h-12 w-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-[#D4AF37] font-bold text-xl">
                        📚
                      </span>
                    </div>
                    <h4 className="font-heading text-lg text-[#D4AF37]">
                      Smart Organization
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Organize notes, problems, and resources by course and
                      topic
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Built Because I Was Tired of Struggling */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, delay: 0.2 },
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <section id="built-because" className="bg-[#13131A]/50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading text-[#D4AF37] mb-6">
                  Built Because I Was Tired of Struggling
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Late nights spent searching for misplaced notes, overwhelm
                  from disorganized resources, and the frustration of
                  inefficient study methods led me to create a better way
                </p>
              </div>

              <FeatureCards />
            </div>
          </section>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, delay: 0.4 },
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <section id="how-it-works" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading text-[#D4AF37] mb-6">
                  How It Works
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Simple, transparent, and effective - our four-step process
                  helps you succeed while helping others
                </p>
              </div>

              <HowItWorks />
            </div>
          </section>
        </motion.div>

        {/* Starting at FUTO, Going Everywhere */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, delay: 0.6 },
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <section id="starting-at-futo" className="bg-[#13131A]/50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading text-[#D4AF37] mb-6">
                  Starting at FUTO, Going Everywhere
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  What began as a personal solution at the Federal University of
                  Technology, Owerri is now expanding to help engineering
                  students across West Africa achieve their academic potential
                </p>
              </div>

              <div className="space-y-12">
                <div className="text-center">
                  <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
                    From a single frustration with disorganized study materials
                    in my dorm room at FUTO, Uni UI has grown into a platform
                    that's helping students across Nigeria and beyond. Our
                    journey reflects the power of solving real problems with
                    thoughtful solutions.
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                  <div className="text-center p-6 bg-[#13131A] rounded-xl border border-[#D4AF37]/20">
                    <div className="h-14 w-14 mx-auto mb-4 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#D4AF37] font-bold text-xl">
                        🏫
                      </span>
                    </div>
                    <h4 className="font-heading text-lg mb-3">FUTO Origins</h4>
                    <p className="text-gray-400 text-sm">
                      Born in the classrooms and dormitories of the Federal
                      University of Technology, Owerri
                    </p>
                  </div>

                  <div className="text-center p-6 bg-[#13131A] rounded-xl border border-[#D4AF37]/20">
                    <div className="h-14 w-14 mx-auto mb-4 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#D4AF37] font-bold text-xl">
                        🌐
                      </span>
                    </div>
                    <h4 className="font-heading text-lg mb-3">
                      West Africa Expansion
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Currently serving students in Nigeria, Ghana, Ghana,
                      Cameroon, and other West African nations
                    </p>
                  </div>

                  <div className="text-center p-6 bg-[#13131A] rounded-xl border border-[#D4AF37]/20">
                    <div className="h-14 w-14 mx-auto mb-4 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#D4AF37] font-bold text-xl">
                        🚀
                      </span>
                    </div>
                    <h4 className="font-heading text-lg mb-3">Global Vision</h4>
                    <p className="text-gray-400 text-sm">
                      Aspiring to help engineering students worldwide organize
                      their studies and succeed together
                    </p>
                  </div>
                </div>

                {/* Pulse visualization placeholder */}
                <div className="mt-16">
                  <div className="h-96 bg-[#13131A]/50 rounded-xl border border-[#D4AF37]/20 relative overflow-hidden">
                    {/* Animated pulse circles */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/30 animate-[pulse_3s_ease-in_out_infinite]"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20 animate-[pulse_5s_ease-in_out_infinite]"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/10 animate-[pulse_7s_ease-in_out_infinite]"></div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-xs text-[#D4AF37]/70">
                      Owerri, Nigeria
                    </div>
                    <div className="absolute top-4 right-4 text-xs text-[#D4AF37]/70">
                      Expanding Daily
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Student Testimonials */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, delay: 0.8 },
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <section id="testimonials" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading text-[#D4AF37] mb-6">
                  Student Testimonials
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Real stories from engineering students who've transformed
                  their study habits with Uni UI
                </p>
              </div>

              <TestimonialCarousel />
            </div>
          </section>
        </motion.div>

        {/* Also Check Out Pantero */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, delay: 1.0 },
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <section id="pantero" className="bg-[#13131A]/50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#13131A] p-8 rounded-xl border border-[#D4AF37]/20 flex items-center space-x-6">
                <div className="flex-shrink-0 h-16 w-16 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold">P</span>
                </div>
                <div>
                  <h3 className="font-heading text-xl mb-2">
                    Also Check Out Pantero
                  </h3>
                  <p className="text-gray-400">
                    A lightweight, privacy-focused note-taking app for students
                    who want simplicity without sacrificing power. Built with
                    the same philosophy as Uni UI but focused purely on
                    note-taking and organization.
                  </p>
                  <Link
                    href={PANTERO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-[#D4AF37] text-black font-sm font-medium rounded hover:bg-[#FFD700] transition-colors"
                  >
                    Visit Pantero →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, delay: 1.2 },
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <section id="faq" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading text-[#D4AF37] mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Answers to common questions about Uni UI, our mission, and how
                  we help engineering students succeed
                </p>
              </div>

              <FAQAccordion />
            </div>
          </section>
        </motion.div>
      </main>

      <Footer />
      <WhatsAppBubble />
    </>
  );
}
