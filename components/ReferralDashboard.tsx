'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2, Trophy, Medal, Users, Crown, MessageCircle, Download, Target, Flame, Gift, Users2, Zap, CrownIcon, Award, Sparkles, Linkedin, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { ShareCard } from '@/components/ShareCard';
import { BADGES, getEarnedBadges, getNextBadge } from '@/lib/referral';
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
  institution: string | null;
  school: string | null;
  department: string | null;
};

const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/UniUICommunity';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Share2,
  Users,
  Trophy,
  Crown,
  Medal,
  Flame,
  Gift,
  Users2,
  Zap,
  CrownIcon,
  Award,
  Sparkles,
};

type Mode = 'lookup' | 'dashboard';

const SHARE_TEMPLATES = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    text: (data: DashboardData) => `🚀 I just joined the Uni UI waitlist (#${data.position})!\n\nJoin with my link and we both jump the queue: ${data.referralLink}\n\nUni UI = University Uploaded Intelligence. Your semester notes + AI = exam success.`,
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    icon: Twitter,
    text: (data: DashboardData) => `Just joined the Uni UI waitlist (#${data.position}) 🚀\n\nAI that answers from YOUR notes, not the internet.\n\nJoin with my link: ${data.referralLink}\n\n#UniUI #ExamPrep #StudentLife`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    text: (data: DashboardData) => `Excited to join the Uni UI waitlist! 🚀\n\nUni UI is building AI-powered exam prep from students' own course materials—no hallucinations, just your notes.\n\nIf you're a student, join my waitlist and we both move up the queue: ${data.referralLink}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    text: (data: DashboardData) => `Hey everyone! I just joined the Uni UI waitlist. It's an AI study assistant that uses YOUR own course materials to give accurate answers. No more generic internet results.\n\nJoin with my link: ${data.referralLink}`,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    text: (data: DashboardData) => `Waitlist locked 🚀 #UniUI\n\nAI that studies from your notes, not the internet.\n\nJoin with my link in bio: ${data.referralLink}`,
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    text: (data: DashboardData) => `Subject: Join me on the Uni UI waitlist\n\nHey,\n\nI just joined the Uni UI waitlist and thought you might want in too. It's an AI tool that answers questions from your actual course materials, not random internet stuff.\n\nHere's my referral link: ${data.referralLink}\n\nLet me know if you join!`,
  },
];

export function ReferralDashboard({ initialCode }: { initialCode?: string } = {}) {
  const [mode, setMode] = useState<Mode>(initialCode ? 'dashboard' : 'lookup');
  const [lookup, setLookup] = useState(initialCode || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(initialCode ? null : null);
  const [copied, setCopied] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [rewards, setRewards] = useState<{ available: any[]; earned: any[] }>({ available: [], earned: [] });
  const [claiming, setClaiming] = useState<string | null>(null);
  const [invites, setInvites] = useState<{ full_name: string; created_at: string }[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [rulesAck, setRulesAck] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('uniui_referral_rules_ack_v1') === '1') {
        setRulesAck(true);
      }
    } catch {}
  }, []);

  const loadDashboard = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 3) return;
    setLoading(true);
    try {
      const isPhone = /^\+?\d{10,15}$/.test(trimmed.replace(/\s+/g, ''));
      const url = isPhone
        ? `/api/referral/stats?phone=${encodeURIComponent(trimmed)}`
        : `/api/referral/stats?code=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url);
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

  useEffect(() => {
    if (!data?.referralCode) return;
    let cancelled = false;
    fetch(`/api/referral/rewards?code=${encodeURIComponent(data.referralCode)}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then((res) => {
        if (!cancelled && res.ok && res.data) {
          setRewards(res.data);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [data?.referralCode]);

  useEffect(() => {
    if (!data?.referralCode) return;
    let cancelled = false;
    fetch(`/api/referral/stats?code=${encodeURIComponent(data.referralCode)}&invites=1`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((json: any) => {
        if (!cancelled && Array.isArray(json.invites)) {
          setInvites(json.invites);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [data?.referralCode]);

  useEffect(() => {
    if (!data?.referralCode) return;
    let cancelled = false;
    fetch(`/api/referral/stats?code=${encodeURIComponent(data.referralCode)}&streak=1`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((json: any) => {
        if (!cancelled && typeof json.streak === 'number') {
          setStreak(json.streak);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [data?.referralCode]);

  useEffect(() => {
    if (initialCode && initialCode.trim().length >= 3) {
      loadDashboard(initialCode.trim());
    }
  }, [initialCode]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = lookup.trim();
    if (!trimmed || trimmed.length < 3) return;
    await loadDashboard(trimmed);
  };

  const reset = () => {
    setMode('lookup');
    setData(null);
    setLookup('');
    setShowShareCard(false);
    setInvites([]);
    setActiveTemplate(null);
    setShowTemplates(false);
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

  const shareViaTemplate = (templateId: string) => {
    if (!data) return;
    const template = SHARE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    const text = template.text(data);
    if (templateId === 'whatsapp' || templateId === 'instagram') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (templateId === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (templateId === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.referralLink)}`, '_blank');
    } else if (templateId === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.referralLink)}`, '_blank');
    } else if (templateId === 'email') {
      window.open(`mailto:?subject=Join me on Uni UI&body=${encodeURIComponent(text)}`, '_blank');
    }
    setActiveTemplate(templateId);
    setTimeout(() => setActiveTemplate(null), 2000);
  };

  const claimReward = async (rewardType: string) => {
    if (!data) return;
    setClaiming(rewardType);
    try {
      const res = await fetch('/api/referral/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: data.referralCode, reward_type: rewardType }),
      });
      if (res.ok) {
        const json = await res.json();
        toast.success(json.reward?.title ? `Reward unlocked: ${json.reward.title}` : 'Reward claimed');
        setRewards((prev) => ({
          ...prev,
          available: prev.available.filter((r) => r.type !== rewardType),
          earned: [...prev.earned, json.reward || { type: rewardType, title: rewardType }],
        }));
      } else {
        const err = await res.json().catch(() => ({ error: 'Failed to claim' }));
        toast.error(err.error || 'Failed to claim reward');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setClaiming(null);
    }
  };

  const nextBadge = data ? getNextBadge({ referralCount: data.referralCount, rank: data.rank, totalWaitlist: data.totalWaitlist }) : null;
  const referralsToNext = useMemo(() => {
    if (!data || !nextBadge) return null;
    if (nextBadge.id === 'first-share') return Math.max(0, 15 - data.referralCount);
    if (nextBadge.id === 'networker') return Math.max(0, 25 - data.referralCount);
    if (nextBadge.id === 'influencer') return Math.max(0, 50 - data.referralCount);
    if (nextBadge.id === 'campus-king') return Math.max(0, 100 - data.referralCount);
    if (nextBadge.id === 'top-10') {
      if (data.rank && data.rank <= 10) return 0;
      return null;
    }
    return null;
  }, [data, nextBadge]);

  const badgeProgress = useMemo(() => {
    if (!data || !nextBadge) return 0;
    if (nextBadge.id === 'first-share') return Math.min(100, (data.referralCount / 15) * 100);
    if (nextBadge.id === 'networker') return Math.min(100, (data.referralCount / 25) * 100);
    if (nextBadge.id === 'influencer') return Math.min(100, (data.referralCount / 50) * 100);
    if (nextBadge.id === 'campus-king') return Math.min(100, (data.referralCount / 100) * 100);
    return 0;
  }, [data, nextBadge]);

  return (
    <section id="referral-dashboard" className="py-20 px-5">
      <div className="max-w-6xl mx-auto">
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

              {/* Referrer join indicator — shows when someone joins via this link */}
              <div className={`rounded-xl border p-4 text-sm flex items-center gap-3 ${
                invites.length > 0
                  ? 'border-gold/30 bg-gold/10 text-gold'
                  : 'border-white/10 bg-white/5 text-muted-foreground'
              }`}>
                <Users className="w-5 h-5 shrink-0" />
                {invites.length > 0 ? (
                  <span>
                    <span className="font-semibold">{invites.length}</span>{' '}
                    {invites.length === 1 ? 'friend has' : 'friends have'} joined via your link.
                  </span>
                ) : (
                  <span>No one has joined via your link yet — share it to start climbing.</span>
                )}
              </div>

              {nextBadge && referralsToNext !== null && referralsToNext > 0 && (
                <div className="glass rounded-xl p-4 border border-gold/20 text-sm text-muted-foreground">
                  You need <span className="text-gold font-semibold">{referralsToNext}</span> more referral
                  {referralsToNext === 1 ? '' : 's'} to unlock <span className="text-foreground font-medium">{nextBadge.name}</span>.
                </div>
              )}

              {streak > 0 && (
                <div className="glass rounded-xl p-4 border border-gold/20 text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Flame className="w-4 h-4 text-gold" />
                  <span>You have a <span className="text-gold font-semibold">{streak}-day</span> referral streak!</span>
                </div>
              )}

              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
                <div className="space-y-6">
                  <QRCodeDisplay url={data.referralLink} title="Your referral QR" />
                  <ShareCard
                    name={data.fullName}
                    referralCode={data.referralCode}
                    position={data.position}
                    referralCount={data.referralCount}
                    url={data.referralLink}
                    institution={data.institution || undefined}
                    department={data.department || undefined}
                  />
                </div>

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
                    <button onClick={() => setShowTemplates((v) => !v)} className="w-full py-3 rounded-xl glass border-gold/40 text-gold font-medium inline-flex items-center justify-center gap-2 hover:bg-gold/10">
                      <Share2 className="w-4 h-4" /> Share everywhere
                    </button>
                  </div>

                  <AnimatePresence>
                    {showTemplates && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                        {SHARE_TEMPLATES.map((template) => {
                          const Icon = template.icon;
                          return (
                            <button
                              key={template.id}
                              onClick={() => shareViaTemplate(template.id)}
                              className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground hover:bg-gold/10 hover:border-gold/30 inline-flex items-center gap-2"
                            >
                              <Icon className="w-4 h-4 text-gold" />
                              {activeTemplate === template.id ? 'Shared!' : template.label}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

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

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">Next badge</span>
                      <span className="text-xs text-gold font-semibold">{Math.round(badgeProgress)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${badgeProgress}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gradient-to-r from-gold to-gold-bright"
                      />
                    </div>
                    {nextBadge && (
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        {nextBadge.name} — {referralsToNext !== null && referralsToNext > 0 ? `${referralsToNext} more` : 'Unlocked!'}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Rewards</div>
                    <div className="space-y-2">
                      {rewards.earned.length === 0 && rewards.available.length === 0 && (
                        <div className="text-xs text-muted-foreground">Rewards will appear here as you refer more friends.</div>
                      )}
                      {rewards.earned.map((r) => (
                        <div key={r.type} className="flex items-center justify-between rounded-lg bg-gold/10 border border-gold/30 px-3 py-2 text-xs">
                          <span className="text-gold font-medium">{r.title || r.type}</span>
                          <span className="text-emerald-400">Earned</span>
                        </div>
                      ))}
                      {rewards.available.map((r) => {
                        const isGiveaway = r.type === 'giveaway_entry';
                        return (
                          <div key={r.type} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs">
                            <div>
                              <div className="text-foreground font-medium">{r.title}</div>
                              <div className="text-muted-foreground">{r.threshold} referrals</div>
                              {isGiveaway && (
                                <div className="text-gold mt-1">Come to WhatsApp and claim your prize</div>
                              )}
                            </div>
                            {isGiveaway ? (
                              <button onClick={shareWhatsApp} className="px-3 py-1.5 rounded-lg bg-gold text-background text-[10px] font-semibold">
                                Go to WhatsApp
                              </button>
                            ) : (
                              <button
                                onClick={() => claimReward(r.type)}
                                disabled={claiming === r.type}
                                className="px-3 py-1.5 rounded-lg bg-gold text-background text-[10px] font-semibold disabled:opacity-60"
                              >
                                {claiming === r.type ? 'Claiming…' : 'Claim'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {invites.length > 0 && (
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Recent joins</div>
                      <div className="space-y-2">
                        {invites.slice(0, 10).map((inv, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-foreground/90">{inv.full_name || 'A friend'}</span>
                            <span className="text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {mode === 'dashboard' && data && !rulesAck && (
        <RulesGate
          onAccept={() => {
            setRulesAck(true);
            try { localStorage.setItem('uniui_referral_rules_ack_v1', '1'); } catch {}
          }}
        />
      )}
    </section>
  );
}

function RulesGate({ onAccept }: { onAccept: () => void }) {
  const rules = [
    'Refer friends with your unique link. Only verified referrals (the friend joins and confirms) count.',
    'Every 7 verified referrals unlock 1 spin — 7 → 1 spin, 14 → 2 spins, 21 → 3 spins, and so on. Unlimited.',
    'Each spin is paid out immediately as a cash prize to your wallet.',
    'At AI launch you receive 500 tokens for every 7 referrals you’ve verified — usable inside the Uni UI app.',
    'Top referrers are featured on the Hall of Fame.',
    'Duplicate signups are blocked (one per WhatsApp number), so only real new signups count.',
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gold/30 bg-[#0A0A0F] p-6 shadow-2xl">
        <div className="mb-4 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-gold/80">Read first</div>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">How the Referral Program Works</h3>
          <p className="mt-2 text-xs text-white/50">You must accept these rules to enter your dashboard.</p>
        </div>
        <ul className="space-y-3">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm text-white/80">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[10px] font-bold text-gold">{i + 1}</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onAccept}
          className="mt-6 w-full rounded-xl bg-gold py-3 text-center font-semibold text-background gold-glow-hover"
        >
          I Understand — Enter Dashboard
        </button>
      </div>
    </div>
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
