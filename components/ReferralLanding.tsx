'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Share2, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralLandingProps {
  code: string;
}

export function ReferralLanding({ code }: ReferralLandingProps) {
  const [referrer, setReferrer] = useState<{ full_name: string; referral_count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/referral/stats?code=${encodeURIComponent(code)}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then((res) => {
        if (!cancelled) {
          if (res.ok && res.data) {
            setReferrer({
              full_name: res.data.fullName,
              referral_count: res.data.referralCount,
            });
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [code]);

  const ctaHref = useMemo(() => `/join?ref=${encodeURIComponent(code)}`, [code]);
  const shareText = useMemo(
    () =>
      `Join the Uni UI waitlist with ${referrer?.full_name || 'a friend'}: ${typeof window !== 'undefined' ? window.location.origin : ''}${ctaHref}`,
    [ctaHref, referrer]
  );

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-5 py-20">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-8 sm:p-10 border border-gold/20 text-center"
        >
          <div className="mx-auto w-14 h-14 rounded-full bg-gold/15 grid place-items-center">
            <Trophy className="w-7 h-7 text-gold" />
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              <div className="h-5 w-40 mx-auto shimmer rounded" />
              <div className="h-3 w-56 mx-auto shimmer rounded" />
            </div>
          ) : referrer ? (
            <>
              <h1 className="mt-5 text-2xl sm:text-4xl font-display font-bold">
                You were invited by <span className="text-gold">{referrer.full_name.split(' ')[0]}</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Join the waitlist with their referral link and you both move up the queue.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Referrer</div>
                  <div className="mt-1 text-lg font-display font-bold">{referrer.full_name.split(' ')[0]}</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Their referrals</div>
                  <div className="mt-1 text-lg font-display font-bold text-gold">{referrer.referral_count}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={ctaHref}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover"
                >
                  <MessageCircle className="w-4 h-4" /> Join with their link
                </a>
                <button
                  onClick={shareWhatsApp}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass border-gold/40 text-gold font-medium hover:bg-gold/10"
                >
                  <Share2 className="w-4 h-4" /> Share invite
                </button>
              </div>

              <p className="mt-4 text-[11px] text-muted-foreground">
                Code: <span className="font-mono text-gold">{code}</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-2xl sm:text-4xl font-display font-bold">This referral link is invalid</h1>
              <p className="mt-3 text-muted-foreground">
                The code <span className="font-mono text-gold">{code}</span> could not be found.
              </p>
              <a href="/join" className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold text-background font-semibold">
                Join the waitlist
              </a>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
