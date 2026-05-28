"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppBubble from "@/components/WhatsAppBubble";
import Link from "next/link";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function LeaderboardPage() {
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopReferrers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: err } = await supabaseClient
          .from("waitlist")
          .select("referred_by")
          .not("referred_by", "is", null)
          .limit(10000);

        if (err) throw err;

        // Manual grouping
        const referrerMap: Record<string, number> = {};
        (data || []).forEach((item: any) => {
          if (item.referred_by) {
            referrerMap[item.referred_by] =
              (referrerMap[item.referred_by] || 0) + 1;
          }
        });

        const formattedData = Object.entries(referrerMap)
          .map(([code, count]) => ({ referral_code: code, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setTopReferrers(formattedData);
      } catch (err) {
        console.error("Error fetching top referrers:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopReferrers();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
          <TableSkeleton rows={5} cols={4} className="w-96" />
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
            <div className="h-16 w-16 mx-auto mb-4 bg-[#EF4444]/20 rounded-full flex items-center justify-center">
              <span className="text-red-400 font-bold text-xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-heading text-[#D4AF37] mb-4">
              Unable to Load Leaderboard
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

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-140px)] px-4">
        <div className="max-w-7xl mx-auto py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-heading text-[#D4AF37] text-center mb-4 animate-fade-in animate-scale-in">
              Top Referrers Leaderboard
            </h1>
            <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto animate-fade-in">
              See who's helping the most friends join Uni UI
            </p>
          </header>

          {topReferrers.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
              <div className="h-20 w-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-500">📊</span>
              </div>
              <h2 className="font-heading text-xl text-[#D4AF37] mb-4">
                No Referrals Yet
              </h2>
              <p className="text-gray-400 mb-6">
                Be the first to refer a friend and climb to the top of our
                leaderboard!
              </p>
              <Link
                href="/join"
                className="inline-block px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-colors"
              >
                Join Waitlist & Start Referring
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-12 gap-4 pb-4 border-b border-[#D4AF37]/20">
                <div className="col-span-1 text-center text-xs font-medium text-gray-400">
                  Rank
                </div>
                <div className="col-span-3 text-center text-xs font-medium text-gray-400">
                  Referral Code
                </div>
                <div className="col-span-6 text-center text-xs font-medium text-gray-400">
                  Referral Count
                </div>
                <div className="col-span-2 text-center text-xs font-medium text-gray-400">
                  Bonus
                </div>
              </div>

              <motion.div className="space-y-2">
                {topReferrers.map((referrer, index) => (
                  <motion.div
                    key={referrer.referral_code}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
                  >
                    <div className="flex-1 text-center text-lg font-medium">
                      <span
                        className={
                          index === 0
                            ? "text-[#FFD700]"
                            : index === 1
                              ? "text-[#C0C0C0]"
                              : index === 2
                                ? "text-[#CD7F32]"
                                : "text-gray-400"
                        }
                      >
                        #{index + 1}
                      </span>
                      {index === 0 && (
                        <span className="ml-2 text-xs bg-[#FFD700]/20 text-[#FFD700] px-2 py-0.5 rounded">
                          Gold
                        </span>
                      )}
                      {index === 1 && (
                        <span className="ml-2 text-xs bg-[#C0C0C0]/20 text-[#C0C0C0] px-2 py-0.5 rounded">
                          Silver
                        </span>
                      )}
                      {index === 2 && (
                        <span className="ml-2 text-xs bg-[#CD7F32]/20 text-[#CD7F32] px-2 py-0.5 rounded">
                          Bronze
                        </span>
                      )}
                    </div>

                    <div className="col-span-3 flex items-center justify-center">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                          <span className="text-[#D4AF37] font-bold">🔑</span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">
                            {referrer.referral_code}
                          </p>
                          <p className="text-xs text-gray-400">Referral Code</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6 flex items-center justify-center">
                      <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                          <span className="text-[#D4AF37] font-bold">👥</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-[#D4AF37]">
                            {referrer.count}
                          </p>
                          <p className="text-xs text-gray-400">
                            Friends Referred
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      {referrer.count >= 10 && (
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                            <span className="text-[#D4AF37] font-bold">🎁</span>
                          </div>
                          <span className="text-xs text-[#D4AF37]">
                            Special Badge
                          </span>
                        </div>
                      )}
                      {referrer.count >= 5 && referrer.count < 10 && (
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                            <span className="text-[#D4AF37] font-bold">⭐</span>
                          </div>
                          <span className="text-xs text-[#D4AF37]">
                            Referral Star
                          </span>
                        </div>
                      )}
                      {referrer.count < 5 && (
                        <span className="text-xs text-gray-400">
                          Keep referring!
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-[#D4AF37]/20">
            <h2 className="text-3xl font-heading text-[#D4AF37] text-center mb-6">
              Leaderboard Statistics
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold text-xl">📊</span>
                  </div>
                </div>
                <h3 className="font-heading text-lg">Total Referrals</h3>
                <p className="text-2xl font-bold text-[#D4AF37]">
                  {topReferrers.reduce((sum, r) => sum + r.count, 0)}
                </p>
              </div>
              <div className="p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold text-xl">👥</span>
                  </div>
                </div>
                <h3 className="font-heading text-lg">Active Referrers</h3>
                <p className="text-2xl font-bold text-[#D4AF37]">
                  {topReferrers.length}
                </p>
              </div>
              <div className="p-4 bg-[#13131A] rounded-xl border border-[#D4AF37]/20 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold text-xl">🏆</span>
                  </div>
                </div>
                <h3 className="font-heading text-lg">Top Referrer</h3>
                <p className="text-2xl font-bold text-[#D4AF37]">
                  {topReferrers[0]?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
