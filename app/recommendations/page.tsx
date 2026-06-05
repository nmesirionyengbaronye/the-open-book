'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ fullName: '', recommendation: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName,
          recommendation: form.recommendation,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Thank you!", { description: "Your recommendation has been submitted." });
      } else {
        const data = await res.json();
        toast.error("Error", { description: data.error || "Failed to submit." });
      }
    } catch (err) {
      toast.error("Error", { description: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold/20">
            <MessageSquare className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-bold">Recommendations</h1>
          <p className="text-muted-foreground mt-2">
            Help us make Uni UI better for everyone. What features or improvements would you like to see?
          </p>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong p-8 rounded-2xl text-center border border-gold/20"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Submission Received</h2>
            <p className="text-muted-foreground mb-6">
              Your feedback is valuable to us. We'll take it into consideration as we build the future of Uni UI.
            </p>
            <button 
              onClick={() => { setSubmitted(false); setForm({ fullName: '', recommendation: '' }); }}
              className="text-gold hover:underline text-sm font-medium"
            >
              Submit another recommendation
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium ml-1">
                Your Full Name
              </label>
              <input
                required
                type="text"
                placeholder="Chisom Okeke"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium ml-1">
                Your Recommendation
              </label>
              <textarea
                required
                rows={5}
                placeholder="I would love to see a feature that..."
                value={form.recommendation}
                onChange={(e) => setForm({ ...form, recommendation: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gold text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gold/90 transition-all disabled:opacity-50 gold-glow"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Recommendation
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
