"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseClient } from "@/lib/supabase";
import { normalizeWhatsApp, isValidNigerianPhone } from "@/lib/validation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton } from "@/components/ui/stat-card-skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Search,
  Link as LinkIcon,
  Copy,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";

export default function RetrievePage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidNigerianPhone(whatsappNumber)) {
      toast.error("Please enter a valid Nigerian WhatsApp number");
      return;
    }

    setIsSearching(true);
    setResult(null);

    try {
      const normalized = normalizeWhatsApp(whatsappNumber);
      const { data, error } = await supabaseClient
        .from("waitlist")
        .select("*")
        .eq("whatsapp_number", normalized)
        .single();

      if (error || !data) {
        toast.error("No registration found for this number");
      } else {
        setResult(data);
        toast.success("Registration found!");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading text-white mb-4">
            Retrieve Your Link
          </h1>
          <p className="text-gray-400">
            Lost your referral code or want to check your position?
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result && !isSearching ? (
            <motion.div
              key="form"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all pl-12"
                      placeholder="+234 XXX XXX XXXX"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-2xl hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Retrieve My Details</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </motion.div>
          ) : isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6"
            >
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <StatCardSkeleton className="w-full" />
              <TableSkeleton rows={2} cols={2} className="w-full" />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-xl font-heading text-white">
                    {result.full_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {result.institution} • {result.department_code || "Student"}
                  </p>
                </div>
                <div className="h-12 w-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold">
                    #{result.position}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">
                    Your Referral Link
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[#D4AF37] font-mono truncate">
                        {`https://waitlist.uniui.com.ng/join?ref=${result.referral_code}`}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `https://waitlist.uniui.com.ng/join?ref=${result.referral_code}`,
                        )
                      }
                      className="p-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] uppercase text-gray-500 mb-1">
                      Level
                    </p>
                    <p className="text-white font-bold">{result.level}L</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] uppercase text-gray-500 mb-1">
                      Semester
                    </p>
                    <p className="text-white font-bold">{result.semester}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setResult(null)}
                className="w-full py-4 bg-white/5 text-gray-400 font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCcw size={18} />
                <span>Search Again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
