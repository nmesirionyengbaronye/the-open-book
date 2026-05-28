"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { supabaseClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppBubble from "@/components/WhatsAppBubble";
import Link from "next/link";
import { StatCardSkeleton } from "@/components/ui/stat-card-skeleton";

export default function MilestonesPage() {
  const [currentCount, setCurrentCount] = useState(0);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const progressRef = useRef(null);
  const progressInView = useInView(progressRef, { once: true });

  useEffect(() => {
    const fetchMilestoneData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { count, error: countError } = await supabaseClient
          .from("waitlist")
          .select("*", { count: "exact", head: true });

        if (countError) throw countError;
        setCurrentCount(count || 0);

        const milestoneDefinitions = [
          {
            id: 1,
            title: "First 10 Signups",
            description: "Initial community formation",
            target: 10,
            icon: "🌱",
            color: "bg-[#D4AF37]/20",
            achieved: false,
          },
          {
            id: 2,
            title: "WhatsApp Group Unlock",
            description: "Exclusive community chat opens",
            target: 50,
            icon: "💬",
            color: "bg-[#D4AF37]/20",
            achieved: false,
          },
          {
            id: 3,
            title: "Beta Access Launch",
            description: "First users get premium features",
            target: 100,
            icon: "🚀",
            color: "bg#[D4AF37]/20",
            achieved: false,
          },
          {
            id: 4,
            title: "Feature Complete",
            description: "All planned features implemented",
            target: 250,
            icon: "✨",
            color: "bg-[#D4AF37]/20",
            achieved: false,
          },
          {
            id: 5,
            title: "West Africa Coverage",
            description: "Representing 5+ countries",
            target: 500,
            icon: "🌍",
            color: "bg-[#D4AF37]/20",
            achieved: false,
          },
          {
            id: 6,
            title: "Global Expansion",
            description: "Going international",
            target: 1000,
            icon: "🌐",
            color: "bg-[#D4AF37]/20",
            achieved: false,
          },
        ];

        const updatedMilestones = milestoneDefinitions.map((milestone) => ({
          ...milestone,
          achieved: currentCount >= milestone.target,
        }));

        setMilestones(updatedMilestones);
      } catch (err) {
        console.error("Error fetching milestone data:", err);
        setError("Failed to load milestone data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestoneData();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
          <div className="space-y-6">
            <div className="w-64">
              <StatCardSkeleton />
            </div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-start space-x-6">
                  <div className="h-12 w-12 rounded-full bg-white/10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded-full w-full" />
                    <div className="h-2 bg-white/10 rounded-full w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
        <WhatsAppBubble />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="h-16 w-16 mx-auto mb-4 bg-[#EF4444]/20 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-red-400 font-bold text-xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-heading text-[#D4AF37] mb-4">
              Unable to Load Milestones
            </h2>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#FFD700] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
        <WhatsAppBubble />
      </>
    );
  }

  const nextMilestone =
    milestones.find((m) => !m.achieved) || milestones[milestones.length - 1];
  const progressToNext = nextMilestone
    ? Math.min(100, (currentCount / nextMilestone.target) * 100)
    : 100;

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-140px)] px-4">
        <div className="max-w-7xl mx-auto py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-heading text-[#D4AF37] text-center mb-4 animate-fade-in animate-scale-in">
              Community Milestones
            </h1>
            <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto animate-fade-in">
              Tracking our journey as we grow together
            </p>
          </header>

          <div className="mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-heading text-[#D4AF37] mb-4 animate-fade-in">
                Current Status: {currentCount} Members
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
                Engineering students united in pursuit of academic excellence
              </p>
            </div>

            <div className="mt-8">
              <div className="space-y-4">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-medium text-[#D4AF37] animate-slide-up">
                    Next Goal: {nextMilestone.title}
                  </span>
                  <span className="text-lg font-medium text-[#D4AF37]">
                    {currentCount} / {nextMilestone.target}
                  </span>
                </div>
                <div className="h-4 bg-[#13131A]/50 rounded-full overflow-hidden">
                  <div ref={progressRef}>
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
                      style={{
                        width: progressInView ? progressToNext + "%" : "0%",
                      }}
                      transition={{ duration: 1 }}
                    ></motion.div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">
                  {progressToNext.toFixed(1)}% to next milestone
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => {
              const milestoneRef = useRef(null);
              const milestoneInView = useInView(milestoneRef, { once: true });
              return (
                <motion.div
                  key={milestone.id}
                  ref={milestoneRef}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-6 mb-8 ${milestone.achieved ? "border-l-2 border-l-[#D4AF37]" : "border-l-2 border-l-[#D4AF37]/30"}`}
                >
                  <div className="flex-shrink-0 flex items-center">
                    <div
                      className={`h-12 w-12 flex-shrink-0 rounded-full flex items-center justify-center ${milestone.achieved ? "bg-[#D4AF37]" : "bg-[#D4AF37]/20"} animate-scale-in`}
                    >
                      <span
                        className={`text-xl ${milestone.achieved ? "text-black" : "text-[#D4AF37]"}`}
                      >
                        {milestone.icon}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <h3
                        className={`font-heading text-lg ${milestone.achieved ? "text-white" : "text-gray-400"}`}
                      >
                        {milestone.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${milestone.achieved ? "bg-[#D4AF37] text-black" : "bg-[#D4AF37]/30 text-[#D4AF37]"}`}
                      >
                        {milestone.achieved ? "ACHIEVED" : "UPCOMING"}
                      </span>
                    </div>
                    <p className="text-gray-400">{milestone.description}</p>

                    {!milestone.achieved && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span>Current: {currentCount}</span>
                          <span>Target: {milestone.target}</span>
                        </div>
                        <div className="h-2 bg-[#13131A]/50 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
                            style={{
                              width:
                                Math.min(
                                  100,
                                  (currentCount / milestone.target) * 100,
                                ) + "%",
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {Math.min(
                            100,
                            (currentCount / milestone.target) * 100,
                          ).toFixed(1)}
                          % complete
                        </p>
                      </div>
                    )}

                    {milestone.achieved && (
                      <p className="mt-4 text-xs text-[#D4AF37]">
                        Achieved when we reached {milestone.target} members
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            {!milestones.every((m) => m.achieved) ? (
              <>
                <h2 className="text-3xl font-heading text-[#D4AF37] mb-6 animate-fade-in">
                  Help Us Reach the Next Milestone
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                  Share your referral code with friends to help us grow the
                  community and unlock new features together
                </p>
                <Link
                  href="/join"
                  className="inline-block px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Share Your Referral Code
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-heading text-[#D4AF37] mb-6">
                  All Milestones Achieved!
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                  Incredible community growth! What's next? Let's keep building
                  together.
                </p>
                <Link
                  href="/join"
                  className="inline-block px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Invite More Friends
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
