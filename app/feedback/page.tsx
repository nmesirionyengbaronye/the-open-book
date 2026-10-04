'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FeedbackPage() {
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
        toast.success('Thank you!', { description: 'Your feedback has been submitted.' });
      } else {
        const data = await res.json();
        toast.error('Error', { description: data.error || 'Failed to submit.' });
      }
    } catch (err) {
      toast.error('Error', { description: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-[#FFD93D] text-black font-body antialiased">
      <div className="mx-auto max-w-md">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black text-[#FFD93D] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-display font-bold uppercase tracking-tight leading-[0.95]">Feedback</h1>
            <p className="mt-3 text-black/70">
              Help us make Uni UI better for everyone. What features or improvements would you like to see?
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border border-black/10 bg-black/5 p-8 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)]"
            >
              <CheckCircle2 className="w-12 h-12 text-black mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 font-display uppercase tracking-tight">Submission Received</h2>
              <p className="text-black/70 mb-6">
                Your feedback is valuable to us. We'll take it into consideration as we build the future of Uni UI.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ fullName: '', recommendation: '' }); }}
                className="text-black underline underline-offset-2 text-sm font-medium"
              >
                Send more feedback
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-black/80 font-medium ml-1">
                  Your Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Chisom Okeke"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-black/40 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-black/80 font-medium ml-1">
                  Your Feedback
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="I would love to see a feature that..."
                  value={form.recommendation}
                  onChange={(e) => setForm({ ...form, recommendation: e.target.value })}
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-black/40 transition-colors resize-none"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-black text-[#FFD93D] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black/90 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}
