'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Coins, CheckCircle2, Clock, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

type PrizeWinner = {
  name: string;
  code: string;
  winnings: number;
  paid: number;
  pending: number;
  fullyPaid: boolean;
};

export default function PrizeWinners() {
  const [winners, setWinners] = useState<PrizeWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyCode, setBusyCode] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rewards/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'prizeWinners' }),
      });
      const d = await res.json();
      if (res.ok && d.winners) setWinners(d.winners);
      else toast.error(d.error || 'Failed to load prize winners');
    } catch {
      toast.error('Failed to load prize winners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function verifyPayment(w: PrizeWinner) {
    if (w.pending <= 0) return;
    setBusyCode(w.code);
    try {
      const res = await fetch('/api/rewards/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pay',
          code: w.code,
          amount: w.pending,
          reference: 'manual-admin-verify',
        }),
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(`Payment marked paid for ${w.name}`);
        await loadAll();
      } else {
        toast.error(d.error || 'Failed to verify payment');
      }
    } catch {
      toast.error('Failed to verify payment');
    } finally {
      setBusyCode(null);
    }
  }

  const totalPending = winners.reduce((s, w) => s + w.pending, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Prize Winners &amp; Payouts</h2>
          <p className="text-muted-foreground text-sm">
            Everyone who has won a cash prize on the wheel, with their payment status.
            {winners.length > 0 && (
              <span className="ml-1">
                ₦{totalPending.toLocaleString()} still pending across {winners.length} winner
                {winners.length === 1 ? '' : 's'}.
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadAll}
          className="inline-flex items-center gap-2 rounded-lg glass border-gold/30 px-3 py-2 text-xs text-gold hover:bg-gold/10"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-xl border border-gold/20 p-8 text-center text-sm text-muted-foreground">
          Loading prize winners…
        </div>
      ) : winners.length === 0 ? (
        <div className="glass rounded-xl border border-gold/20 p-8 text-center text-sm text-muted-foreground">
          No prizes have been won yet.
        </div>
      ) : (
        <div className="overflow-x-auto glass rounded-xl border border-gold/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Winner</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3 text-right">Winnings</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Pending</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((w) => (
                <tr key={w.code} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-white">{w.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{w.code}</td>
                  <td className="px-4 py-3 text-right font-mono text-[#D4AF37]">₦{w.winnings.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono">₦{w.paid.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {w.pending > 0 ? <span className="text-amber-400">₦{w.pending.toLocaleString()}</span> : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {w.fullyPaid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                        <BadgeCheck className="h-3.5 w-3.5" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-medium text-amber-400">
                        <Clock className="h-3.5 w-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {w.fullyPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyPayment(w)}
                        disabled={busyCode === w.code}
                        className="inline-flex items-center gap-1 rounded-lg bg-gold px-3 py-1.5 text-[11px] font-semibold text-background disabled:opacity-60"
                      >
                        <Coins className="h-3.5 w-3.5" />
                        {busyCode === w.code ? 'Verifying…' : 'Verify payment'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
