'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, Copy, Check, Frown } from "lucide-react";

export function Retrieve() {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "found" | "missing">("idle");
  const [foundLink, setFoundLink] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading"); setCopied(false);

    const digits = phone.replace(/\D/g, "");
    const normalized = digits.startsWith("234") ? "+" + digits : digits.startsWith("0") ? "+234" + digits.slice(1) : "+234" + digits;

    try {
      const res = await fetch(`/api/waitlist/retrieve?phone=${encodeURIComponent(normalized)}`);
      
      if (res.ok) {
        const data = await res.json();
        setFoundLink(`${window.location.origin}/?ref=${data.referral_code}`);
        setState("found");
      } else {
        setState("missing");
      }
    } catch {
      setState("missing");
    }
  };

  return (
    <section className="py-20 px-5 bg-surface/30">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">ALREADY JOINED?</div>
          <h2 className="mt-3 text-2xl sm:text-4xl font-display font-bold">Recover your referral link</h2>
        </div>
        <form onSubmit={submit} className="glass-strong rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="Your WhatsApp number"
              className="flex-1 bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold"
              required
            />
            <button type="submit" disabled={state === "loading" || !phone}
              className="px-5 py-2.5 rounded-lg bg-gold text-background font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-40">
              {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Find link
            </button>
          </div>
          <AnimatePresence mode="wait">
            {state === "loading" && (
              <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5 space-y-2">
                <div className="h-3 w-2/3 rounded shimmer" />
                <div className="h-3 w-1/2 rounded shimmer" />
              </motion.div>
            )}
            {state === "found" && (
              <motion.div key="f" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-5 glass rounded-lg p-4">
                <div className="text-xs text-emerald-400 mb-2">Found it!</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-foreground/80 font-mono break-all">{foundLink}</code>
                  <button type="button" onClick={() => { navigator.clipboard.writeText(foundLink); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                    className="p-2 rounded-md glass border-gold/40">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold" />}
                  </button>
                </div>
              </motion.div>
            )}
            {state === "missing" && (
              <motion.div key="m" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-5 glass rounded-lg p-4 text-center">
                <Frown className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  I couldn't find that number. Want to <a href="/join" className="text-gold underline">join the waitlist</a> instead?
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}