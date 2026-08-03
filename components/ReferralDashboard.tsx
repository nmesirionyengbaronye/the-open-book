'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2, Trophy, Medal, Users, Crown, MessageCircle } from 'lucide-react';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { BADGES, getEarnedBadges } from '@/lib/referral';
import { toast } from 'sonner';

type DashboardData = {
  referralCode: string;
  fullName: string;
  position: number;
  referralCount: number;
  rank: number | null;
  totalWaitlist: number;
  badges: { id: string; name: string; description: string; icon: string }[];
  referralLink: string;
};

const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/UniUICommunity';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Share2,
  Users,
  Trophy,
  Crown,
  Medal,
};

export function ReferralDashboard() {
  const [mode, setMode] = useState<'lookup' | 'dashboard'>('lookup');
  const [lookup, setLookup] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = lookup.trim();
    if (!trimmed || trimmed.length < 3) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/referral/stats?code=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Lookup failed' }));
        toast.error(err.error || 'Could not find that referral code.');
        setLoading(false);
        return;
      }
      const json: DashboardData = await res.json();
      setData(json);
      setMode('dashboard');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMode('lookup');
    setData(null);
    setLookup('');
  };

  const shareText = useMemo(() => {
    if (!data) return '';
    return `I just joined the Uni UI waitlist (#${data.position}). Join with my link, we both jump the queue: ${data.referralLink}`;
  }, [data]);

  const shareWhatsApp = () => {
    if (!data) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const copyLink = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      toast.success('Referral link copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <section id="referral-dashboard" className="py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">Growth Engine</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">
            Your <span className="text-gold">Referral</span> Dashboard
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Track your queue position, share your link, earn badges, and climb the leaderboard.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'lookup' ? (
            <motion.div
              key="lookup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-lg mx-auto glass-strong rounded-2xl p-6 border border-gold/20"
            >
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Referral code or WhatsApp number
                  </label>
                  <input
                    value={lookup}
                    onChange={(e) => setLookup(e.target.value)}
                    placeholder="e.g. UNI-1A2B3C or +2348012345678"
                    className="w-full bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? 'Looking up…' : 'Open dashboard'}
                </button>
              </form>
            </motion.div>
          ) : data ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Welcome back</div>
                  <h3 className="text-2xl font-display font-bold">{data.fullName.split(' ')[0]}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Code: <span className="font-mono text-gold">{data.referralCode}</span>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="text-xs text-muted-foreground hover:text-gold underline underline-offset-4"
                >
                  Look up another
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <StatBox label="Queue position" value={`#${data.position}`} />
                <StatBox label="Referrals" value={String(data.referralCount)} />
                <StatBox label="Leaderboard rank" value={data.rank ? `#${data.rank}` : 'Unranked'} />
              </div>

              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
                <QRCodeDisplay url={data.referralLink} title="Your referral QR" />

                <div className="glass-strong rounded-2xl p-6 border border-gold/20 flex flex-col gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Your referral link</div>
                    <div className="flex gap-2">
                      <input readOnly value={data.referralLink} className={inputCls + ' font-mono text-xs'} />
                      <button onClick={copyLink} className="px-3 rounded-lg glass border-gold/40 hover:bg-gold/10" aria-label="Copy">
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={shareWhatsApp} className="w-full py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover inline-flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Share on WhatsApp
                    </button>
                    <button onClick={copyLink} className="w-full py-3 rounded-xl glass border-gold/40 text-gold font-medium inline-flex items-center justify-center gap-2 hover:bg-gold/10">
                      <Share2 className="w-4 h-4" /> Copy link
                    </button>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Badges</div>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {data.badges.length === 0 ? (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground">
                            Share your link to unlock your first badge.
                          </motion.span>
                        ) : (
                          data.badges.map((b) => {
                            const Icon = iconMap[b.icon] || Trophy;
                            return (
                              <motion.span
                                key={b.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-medium"
                              >
                                <Icon className="w-3.5 h-3.5" /> {b.name}
                              </motion.span>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-display font-bold text-gold">{value}</div>
    </div>
  );
}

const inputCls = 'w-full bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition';
