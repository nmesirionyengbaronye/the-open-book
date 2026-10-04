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
    <main className="mx-auto max-w-xl px-4 py-12 bg-[#FFD93D] text-black font-body antialiased">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Data</span>
      </div>
      <h1 className="mt-6 text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight leading-[0.95]">
        Data Deletion Request
      </h1>
      <p className="mt-3 text-sm text-black/70">
        Submit a request to delete your personal data. We will process it within 30 days.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-black/80">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08012345678"
            className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm text-black placeholder:text-black/50 focus:border-black/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-black/80">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm text-black placeholder:text-black/50 focus:border-black/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-black/80">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us why you want to delete your data"
            className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm text-black placeholder:text-black/50 focus:border-black/40 focus:outline-none"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-[#FFD93D] transition hover:bg-black/90 disabled:opacity-50"
        >
          {status === 'loading' ? 'Submitting…' : 'Submit deletion request'}
        </button>
        {status === 'success' && (
          <p className="text-sm text-emerald-600">Request submitted. We will process it within 30 days.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600">Failed to submit request. Please try again.</p>
        )}
      </form>
    </main>
  );
}
