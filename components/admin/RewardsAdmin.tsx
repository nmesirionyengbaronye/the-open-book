'use client';

import { useCallback, useEffect, useState } from 'react';
import { Coins, Gift, Trophy, Users, RefreshCw, AlertTriangle, Ban, Send, History } from 'lucide-react';
import { toast } from 'sonner';

type Stats = {
  totalWaitlist: number;
  verifiedUsers: number;
  verifiedReferrals: number;
  pendingReferrals: number;
  boxesOpened: number;
  spinsCompleted: number;
  moneyPaid: number;
  tokensAtLaunch: number;
  broadcastsSent: number;
  lastBroadcastAt: string | null;
};

type RecentSpin = { name: string; code: string; prize: number; paid: boolean; created_at: string };
type TopEarner = { name: string; code: string; balance: number };
type BroadcastRecord = { id: number; message: string; sent: number; failed: number; created_at: string };

export default function RewardsAdmin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<{ recentSpins: RecentSpin[]; topEarners: TopEarner[]; broadcasts: BroadcastRecord[] } | null>(null);
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState('');

  const loadAll = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([
        fetch('/api/rewards/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'stats' }) }).then((r) => r.json()),
        fetch('/api/rewards/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'activity' }) }).then((r) => r.json()),
      ]);
      if (s && !s.error) setStats(s);
      else toast.error(s?.error || 'Failed to load stats');
      if (a && !a.error) setActivity(a);
    } catch {
      toast.error('Failed to load rewards data');
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function act(action: string, extra: Record<string, unknown> = {}) {
    if (!['broadcast', 'reset', 'stats', 'activity'].includes(action) && !code.trim()) {
      toast.error('Enter a referral code first');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/rewards/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, code: code.trim(), ...extra }),
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(d.error ? d.error : 'Action complete');
        await loadAll();
      } else {
        toast.error(d.error || 'Action failed');
      }
    } catch {
      toast.error('Action failed');
    } finally {
      setBusy(false);
    }
  }

  const cards = [
    { label: 'Waitlist Users', value: stats?.totalWaitlist ?? '—', icon: Users },
    { label: 'Verified (Telegram)', value: stats?.verifiedUsers ?? '—', icon: Trophy },
    { label: 'Verified Referrals', value: stats?.verifiedReferrals ?? '—', icon: Gift },
    { label: 'Pending Referrals', value: stats?.pendingReferrals ?? '—', icon: Users },
    { label: 'Boxes Opened', value: stats?.boxesOpened ?? '—', icon: Gift },
    { label: 'Spins Completed', value: stats?.spinsCompleted ?? '—', icon: Coins },
    { label: 'Cash Paid (₦)', value: stats ? stats.moneyPaid.toLocaleString() : '—', icon: Coins },
    { label: 'Tokens @ Launch', value: stats ? stats.tokensAtLaunch.toLocaleString() : '—', icon: Gift },
    { label: 'Broadcasts Sent', value: stats?.broadcastsSent ?? '—', icon: Send },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Rewards Platform — Live Tracker</h2>
          <p className="text-muted-foreground text-sm">
            Real-time view of everything happening in the giveaway, spins, payouts and broadcasts.
          </p>
        </div>
        <button
          onClick={loadAll}
          className="inline-flex items-center gap-2 rounded-lg glass border-gold/30 px-3 py-2 text-xs text-gold hover:bg-gold/10"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="glass rounded-xl p-4 border border-gold/10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Icon className="h-4 w-4 text-gold" /> {c.label}
              </div>
              <div className="mt-2 font-display text-2xl text-white">{c.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent spins */}
        <div className="glass rounded-xl border border-gold/20 p-5">
          <h3 className="mb-3 text-sm font-semibold text-white/80">Recent Spins</h3>
          <div className="max-h-72 overflow-y-auto space-y-1">
            {activity?.recentSpins?.length ? (
              activity.recentSpins.map((s, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 py-1.5 text-xs">
                  <span className="truncate text-white/70">{s.name} <span className="text-white/30 font-mono">({s.code})</span></span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[#D4AF37]">₦{s.prize.toLocaleString()}</span>
                    <span className={s.paid ? 'text-emerald-400' : 'text-white/40'}>{s.paid ? 'paid' : 'pending'}</span>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No spins yet.</p>
            )}
          </div>
        </div>

        {/* Top earners */}
        <div className="glass rounded-xl border border-gold/20 p-5">
          <h3 className="mb-3 text-sm font-semibold text-white/80">Top Earners (Cash Wallet)</h3>
          <div className="max-h-72 overflow-y-auto space-y-1">
            {activity?.topEarners?.length ? (
              activity.topEarners.map((e, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 py-1.5 text-xs">
                  <span className="truncate text-white/70">{i + 1}. {e.name} <span className="text-white/30 font-mono">({e.code})</span></span>
                  <span className="font-mono text-[#D4AF37]">₦{e.balance.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No earnings yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast history */}
      <div className="glass rounded-xl border border-gold/20 p-5">
        <div className="mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-semibold text-white/80">Broadcast History</h3>
        </div>
        <div className="space-y-2">
          {activity?.broadcasts?.length ? (
            activity.broadcasts.map((b) => (
              <div key={b.id} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs">
                <p className="text-white/70 line-clamp-2">{b.message}</p>
                <p className="mt-1 text-white/40">
                  {new Date(b.created_at).toLocaleString()} · sent {b.sent} · failed {b.failed}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No broadcasts sent yet.</p>
          )}
        </div>
      </div>

      <div className="glass rounded-xl border border-gold/20 p-5 space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            Referral code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. UNI-1A2B3C"
            className="w-full bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button disabled={busy} onClick={() => act('adjust', { delta: 1 })} className="rounded-lg bg-gold px-3 py-2 text-xs font-semibold text-background disabled:opacity-60">
            +1 Referral
          </button>
          <button disabled={busy} onClick={() => act('adjust', { delta: -1 })} className="rounded-lg glass border-gold/30 px-3 py-2 text-xs text-gold disabled:opacity-60">
            −1 Referral
          </button>
          <button disabled={busy} onClick={() => act('disqualify', { disqualified: true })} className="rounded-lg glass border-red-500/40 px-3 py-2 text-xs text-red-300 disabled:opacity-60">
            <Ban className="mr-1 inline h-3.5 w-3.5" /> Disqualify
          </button>
          <button disabled={busy} onClick={() => act('disqualify', { disqualified: false })} className="rounded-lg glass border-gold/30 px-3 py-2 text-xs text-gold disabled:opacity-60">
            Reinstate
          </button>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount ₦" type="number" className="w-full bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold" />
          <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Reference" className="w-full bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold" />
          <button disabled={busy} onClick={() => act('pay', { amount: Number(amount) || 0, reference })} className="rounded-lg bg-gold px-4 py-2.5 text-xs font-semibold text-background disabled:opacity-60">
            Mark Paid
          </button>
        </div>

        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 text-xs text-red-300 hover:bg-red-500/10">
              <AlertTriangle className="h-3.5 w-3.5" /> Reset Giveaway
            </button>
          ) : (
            <>
              <span className="text-xs text-red-300">This clears all boxes, tickets, wallets &amp; referrals. Are you sure?</span>
              <button onClick={async () => { setBusy(true); try { const res = await fetch('/api/rewards/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset' }) }); const d = await res.json(); if (res.ok) toast.success('Giveaway reset'); else toast.error(d.error || 'Reset failed'); await loadAll(); } catch { toast.error('Reset failed'); } finally { setBusy(false); setConfirmReset(false); } }} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">
                Confirm Reset
              </button>
              <button onClick={() => setConfirmReset(false)} className="rounded-lg glass border-white/20 px-4 py-2 text-xs text-white/70">
                Cancel
              </button>
            </>
          )}
        </div>

        <div className="glass rounded-xl border border-gold/20 p-5 space-y-3">
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
            Broadcast to all verified Telegram users
          </label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Message to send (HTML supported)…" className="w-full bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold" />
          <button disabled={busy} onClick={() => act('broadcast', { message })} className="rounded-lg bg-gold px-4 py-2.5 text-xs font-semibold text-background disabled:opacity-60">
            Send Broadcast
          </button>
        </div>

        <div className="glass rounded-xl border border-gold/20 p-5 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Export &amp; reports</p>
          <div className="flex flex-wrap gap-2">
            {(['users', 'referrals', 'spins', 'payments'] as const).map((t) => (
              <a key={t} href={`/api/rewards/export?table=${t}`} target="_blank" rel="noreferrer" className="rounded-lg glass border-gold/30 px-3 py-2 text-xs text-gold hover:bg-gold/10">
                {t}.csv
              </a>
            ))}
          </div>
          <a href="/winners" target="_blank" rel="noreferrer" className="inline-block text-xs text-gold underline underline-offset-4">
            View Hall of Fame →
          </a>
        </div>
      </div>
    </div>
  );
}
