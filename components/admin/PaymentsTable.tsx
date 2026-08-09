'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Wallet, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentRow {
  id: string;
  user_id: string;
  referral_code: string | null;
  full_name: string | null;
  amount: number;
  status: string;
  reference: string | null;
  paid_at: string | null;
  created_at: string;
}

export default function PaymentsTable() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/admin/payments')
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then((res) => {
        if (!cancelled && res.ok) {
          setPayments(res.data.payments || []);
        } else if (!cancelled) {
          toast.error(res.data?.error || 'Failed to load payments');
        }
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load payments');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return payments;
    const q = search.trim().toLowerCase();
    return payments.filter((p) =>
      (p.referral_code || '').toLowerCase().includes(q) ||
      (p.full_name || '').toLowerCase().includes(q) ||
      (p.reference || '').toLowerCase().includes(q) ||
      String(p.amount).includes(q)
    );
  }, [payments, search]);

  const totalPaid = useMemo(
    () => filtered.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0),
    [filtered]
  );

  const pendingTotal = useMemo(
    () => filtered.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0),
    [filtered]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, reference, amount"
            className="pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-gold/20 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-emerald-400" /> Paid: ₦{totalPaid.toLocaleString()}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-amber-300" /> Pending: ₦{pendingTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="glass rounded-xl border border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Paid at</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Loading payments…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No payments found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{p.full_name || '—'}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{p.referral_code || p.user_id}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#D4AF37]">₦{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ' +
                          (p.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-amber-500/10 text-amber-200')
                        }
                      >
                        {p.status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.reference || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {p.paid_at ? new Date(p.paid_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
