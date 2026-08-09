'use client';

import { useState, useEffect } from 'react';

export default function DataDeletionPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/data-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, reason }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setPhone('');
      setEmail('');
      setReason('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Data Deletion Request</h1>
      <p className="mt-2 text-sm text-white/60">
        Submit a request to delete your personal data. We will process it within 30 days.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-xs text-white/60">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08012345678"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/60">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/60">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us why you want to delete your data"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
        >
          {status === 'loading' ? 'Submitting…' : 'Submit deletion request'}
        </button>
        {status === 'success' && (
          <p className="text-sm text-green-400">Request submitted. We will process it within 30 days.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400">Failed to submit request. Please try again.</p>
        )}
      </form>
    </div>
  );
}
