"use client";

import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserPlus,
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

const JoinPage = () => {
  const [step, setStep] = useState(1);
  const [referralCode, setReferralCode] = useState("");
  const [email, setEmail] = useState("");
  const [isCheckingReferral, setIsCheckingReferral] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    toast.success("You've successfully joined the waitlist!", {
      description: "Check your email for confirmation.",
      style: { background: "#000", border: "1px solid #d4af37", color: "#fff" },
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome aboard!
          </h2>
          <p className="text-muted-foreground mb-6">
            You're now on the exclusive waitlist. We'll notify you when spots
            open up.
          </p>
          <div className="flex flex-col space-y-4">
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = `mailto:${process.env.NEXT_PUBLIC_EMAIL}`;
              }}
              className="w-full"
            >
              Contact Us via Email
            </Button>
            <Button
              onClick={() => {
                window.open(
                  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL,
                  "_blank",
                );
              }}
              className="w-full bg-amber-900/50 hover:bg-amber-900/100 border border-amber-500/50"
            >
              Join Our WhatsApp Community
            </Button>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-amber-900/50 hover:bg-amber-900/100 border border-amber-500/50"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: step === 1 ? 0 : 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: step === 1 ? 0 : -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Join the Waitlist
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                Be among the first to experience our exclusive offering. Enter
                your email and optional referral code to get started.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border border-white/10 placeholder-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="referral"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Referral Code (Optional)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="referral"
                      placeholder="Enter referral code"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      disabled={isCheckingReferral}
                      className="flex-1 bg-white/5 border border-white/10 placeholder-muted-foreground"
                    />
                    {isCheckingReferral && (
                      <Skeleton className="h-4 w-20 rounded" />
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCheckingReferral(true);
                        // Simulate referral check
                        setTimeout(() => {
                          setIsCheckingReferral(false);
                          toast.success("Referral code validated!", {
                            description: "You'll receive bonus points.",
                            style: {
                              background: "#000",
                              border: "1px solid #d4af37",
                              color: "#fff",
                            },
                          });
                        }, 1000);
                      }}
                      disabled={isCheckingReferral}
                      className="bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      Check
                    </Button>
                  </div>
                  {referralCode && !isCheckingReferral && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Referral code: {referralCode}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-amber-900/50 hover:bg-amber-900/100 border border-amber-500/50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                By joining, you agree to our{" "}
                <a href="#" className="underline">
                  Terms of Service
                </a>{" "}
                and
                <a href="#" className="underline">
                  Privacy Policy
                </a>
                .
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Invite Friends
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                Share your unique referral link to earn rewards when friends
                join using your code.
              </p>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Your Referral Link:
                </p>
                <div className="flex items-center space-x-3 mb-4 p-3 bg-white/10 rounded">
                  <Link
                    href={`https://yourapp.com/ref/${email.split("@")[0]}`}
                    className="flex-1 break-all text-sm font-mono text-white"
                  >
                    https://yourapp.com/ref/{email.split("@")[0]}
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://yourapp.com/ref/${email.split("@")[0]}`,
                      );
                      toast.success("Link copied!", {
                        style: {
                          background: "#000",
                          border: "1px solid #d4af37",
                          color: "#fff",
                        },
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with friends. When they join using your code,
                  you both get bonus rewards.
                </p>
              </div>
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={prevStep} className="mr-4">
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-amber-900/50 hover:bg-amber-900/100 border border-amber-500/50"
                >
                  Continue
                </Button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Almost There!
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                Review your details before joining the waitlist.
              </p>
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </p>
                  <p className="text-white">{email}</p>
                </div>
                {referralCode && (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Referral Code
                    </p>
                    <p className="text-white">{referralCode}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={prevStep} className="mr-4">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-amber-900/50 hover:bg-amber-900/100 border border-amber-500/50"
                >
                  Confirm & Join
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default JoinPage;
