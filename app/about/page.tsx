"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-28 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <div className="text-center mb-20">
            <h1 className="text-5xl font-heading text-[#D4AF37] mb-6">
              I Built the Study Tool I Needed.
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The personal journey behind Uni UI - from frustration to solution
            </p>
          </div>
        </motion.div>

        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <section id="problem" className="mb-24">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-8">
              <h2 className="text-3xl font-heading text-[#D4AF37] mb-4">
                The Problem
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Engineering school overwhelmed me with disjointed lecture notes,
                scattered practice problems, and impossible-to-track deadlines.
                I spent more time organizing my study materials than actually
                learning from them.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                My typical study session looked like this: 20 minutes searching
                for yesterday's lecture notes, 15 minutes trying to find that
                specific practice problem from last week, 10 minutes
                reorganizing my digital folders, and only then could I begin
                actual studying. By mid-semester, I had dozens of fragmented
                files across multiple platforms, making efficient review nearly
                impossible.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Existing solutions were either too complex, too expensive, or
                didn't understand the specific needs of engineering students
                dealing with heavy mathematical content, technical diagrams, and
                multi-step problem solutions. Generic note-taking apps forced me
                to adapt my engineering-specific workflows to their limitations,
                rather than the other way around.
              </p>

              {/* Problem visualization */}
              <div className="mt-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20 text-center">
                    <div className="h-12 w-12 mx-auto mb-3 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#D4AF37] font-bold text-xl">
                        📄
                      </span>
                    </div>
                    <h4 className="font-heading text-lg">Disorganized Notes</h4>
                    <p className="text-gray-400 text-sm">
                      Lecture notes scattered across notebooks, tablets, and
                      cloud storage
                    </p>
                  </div>

                  <div className="p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20 text-center">
                    <div className="h-12 w-12 mx-auto mb-3 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#D4AF37] font-bold text-xl">
                        🔢
                      </span>
                    </div>
                    <h4 className="font-heading text-lg">
                      Lost Practice Problems
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Difficulty finding specific problems for review and
                      practice
                    </p>
                  </div>

                  <div className="p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20 text-center">
                    <div className="h-12 w-12 mx-auto mb-3 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#D4AF37] font-bold text-xl">
                        ⏰
                      </span>
                    </div>
                    <h4 className="font-heading text-lg">Wasted Time</h4>
                    <p className="text-gray-400 text-sm">
                      Hours spent searching instead of learning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <section id="solution" className="mb-24">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-8">
              <h2 className="text-3xl font-heading text-[#D4AF37] mb-4">
                The Solution
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                I created Uni UI as a personal study organizer that evolved into
                a platform to help other students. It combines several key
                elements that address the specific pain points I experienced:
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg mb-2">
                      Smart Organization Engine
                    </h3>
                    <p className="text-gray-400">
                      Automatically categorizes and structures your study
                      materials by course, topic, difficulty level, and resource
                      type. No more manual folder creation or inconsistent
                      naming conventions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg mb-2">
                      Intelligent Progress Tracking
                    </h3>
                    <p className="text-gray-400">
                      Identifies your hardest courses and topics through
                      analysis of your study patterns, helping you know exactly
                      where to focus your limited study time for maximum impact.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg mb-2">
                      Social Accountability System
                    </h3>
                    <p className="text-gray-400">
                      The referral-based waitlist creates positive peer pressure
                      - you help friends succeed while advancing your own access
                      to premium features. This turns studying from a solitary
                      struggle into a collaborative journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg mb-2">
                      Resource Optimization
                    </h3>
                    <p className="text-gray-400">
                      Reduces cognitive load by organizing information
                      intuitively, allowing your brain to focus on understanding
                      concepts rather than searching for materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Who's Behind This */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <section id="founder" className="mb-24">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-8">
              <h2 className="text-3xl font-heading text-[#D4AF37] mb-4">
                Who's Behind This
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <p className="text-gray-400 leading-relaxed mb-4">
                    I'm a engineering student from Owerri who built Uni UI
                    during my sophomore year after failing to find a tool that
                    matched my specific needs. Late nights of frustration with
                    disorganized study materials led to the first prototype,
                    which I've continuously improved based on feedback from
                    fellow students.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    What started as a simple script to organize my lecture notes
                    evolved into a comprehensive platform after I realized many
                    of my classmates were struggling with the same issues. The
                    turning point came when three friends asked if they could
                    use my system - that's when I knew I had something valuable
                    to share.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Every feature in Uni UI solves a problem I've personally
                    experienced - from the waitlist system that encourages
                    sharing to the hardest course tracker that helps prioritize
                    study time. I've walked the path you're on, and I built this
                    tool to make that journey easier for you.
                  </p>
                </div>

                <div className="relative h-96 w-full">
                  <div className="absolute inset-0 bg-[#13131A]/50 rounded-xl border border-[#D4AF37]/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-16 w-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-[#D4AF37] font-bold text-xl">
                          👨‍🎓
                        </span>
                      </div>
                      <h3 className="font-heading text-lg text-[#D4AF37] mb-2">
                        Founder & Developer
                      </h3>
                      <p className="text-gray-400 text-sm max-w-xs">
                        Engineering Student • Owerri, Nigeria
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* The Name */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <section id="name" className="mb-24">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-8">
              <h2 className="text-3xl font-heading text-[#D4AF37] mb-4">
                The Name
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                "Uni" represents both "university" and "unified" - bringing
                together all your study materials into one coherent system. "UI"
                stands for "University Intelligence" but also works as a play on
                "user interface" - because great study tools should be intuitive
                and beautiful to use.
              </p>
              <p className="text-gray-400 leading-relaxed">
                The name reflects my belief that university education should
                empower rather than overwhelm, and that intelligence flows best
                when it's organized and shared. When your study materials are
                unified, your intellectual potential can be unleashed.
              </p>

              <div className="mt-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20">
                    <h4 className="font-heading text-lg mb-2 text-[#D4AF37]">
                      Uni
                    </h4>
                    <p className="text-gray-400 text-sm">
                      University + Unified = All your study materials in one
                      intelligent system
                    </p>
                  </div>

                  <div className="p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20">
                    <h4 className="font-heading text-lg mb-2 text-[#D4AF37]">
                      UI
                    </h4>
                    <p className="text-gray-400 text-sm">
                      University Intelligence + User Interface = Smart tools
                      that are beautiful to use
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* The Goal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <section id="goal" className="mb-24">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-8">
              <h2 className="text-3xl font-heading text-[#D4AF37] mb-4">
                The Goal
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                To help engineering students across West Africa spend less time
                fighting with disorganization and more time actually learning
                and understanding their course material. I want Uni UI to be the
                tool I wished I had when I was struggling - one that makes
                success feel achievable rather than impossible.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Whether you're in FUTO, UNN, UNILAG, or any other institution,
                if you're an engineering student tired of struggling with
                disorganization, Uni UI is built for you. This isn't just about
                better grades - it's about reducing stress, increasing
                confidence, and helping you reach your full potential as an
                engineer.
              </p>
              <p className="text-gray-400">
                My vision extends beyond individual success to creating a
                community of engineers who lift each other up. When we share
                knowledge and resources effectively, we all rise together - and
                that's how we build a stronger engineering future for West
                Africa.
              </p>

              {/* Call to action */}
              <div className="mt-12 text-center">
                <Link
                  href="/join"
                  className="inline-block px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Join the Waitlist
                </Link>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
