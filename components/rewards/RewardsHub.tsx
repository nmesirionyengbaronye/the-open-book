'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, AlertCircle, Gift, Trophy, Wallet, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import ReferralProgressBar from './ReferralProgressBar';
import MysteryBox from './MysteryBox';
import SpinWheel from './SpinWheel';
import WalletPanel from './WalletPanel';
import LeaderboardPanel from './LeaderboardPanel';
import type {
  RewardsProfile,
  ReferralsResponse,
  LeaderboardEntry,
  WalletInfo,
} from './types';

export default function RewardsHub({ code }: { code: string }) {
  const [profile, setProfile] = useState<RewardsProfile | null>(null);
  const [referrals, setReferrals] = useState<ReferralsResponse | null>(null);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const [p, r, l, w] = await Promise.all([
        fetch(`/api/rewards/profile?code=${encodeURIComponent(code)}`).then((x) =>
          x.ok ? x.json() : Promise.reject(new Error('profile'))
        ),
        fetch(`/api/rewards/referrals?code=${encodeURIComponent(code)}`).then((x) =>
          x.ok ? x.json() : null
        ),
        fetch(`/api/rewards/leaderboard?code=${encodeURIComponent(code)}`).then((x) =>
          x.ok ? x.json() : []
        ),
        fetch(`/api/rewards/wallet?code=${encodeURIComponent(code)}`).then((x) =>
          x.ok ? x.json() : null
        ),
      ]);
      setProfile(p);
      setReferrals(r);
      setBoard(l);
      setWallet(w);
    } catch (e: any) {
      setError(e?.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
        <Loader2 className="mx-auto h-5 w-5 animate-spin" /> Loading rewards…
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
        <AlertCircle className="mx-auto mb-2 h-5 w-5" />
        {error || 'Rewards unavailable'}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        <Sparkles className="h-4 w-4" />
        <h3 className="text-lg font-semibold">Rewards &amp; Game</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Verified referrals" value={String(profile.verifiedReferrals)} icon={<Gift className="h-4 w-4" />} />
        <Stat label="Rank" value={profile.rank ? `#${profile.rank}` : '—'} icon={<Trophy className="h-4 w-4" />} />
        <Stat label="Spin tickets" value={String(profile.spinTickets)} icon={<Sparkles className="h-4 w-4" />} />
        <Stat label="Wallet (cash)" value={`₦${profile.walletBalance}`} icon={<Wallet className="h-4 w-4" />} />
        <Stat label="Tokens @ launch" value={String(profile.launchTokens)} icon={<Gift className="h-4 w-4" />} />
      </div>

      {profile.disqualified && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          This account has been disqualified from the giveaway.
        </div>
      )}

      <ReferralProgressBar
        completed={referrals?.progress.completed ?? 0}
        milestone={referrals?.progress.milestone ?? 7}
        need={referrals?.progress.need ?? 0}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <MysteryBox
          code={profile.referralCode}
          boxesDue={profile.boxesDue}
          boxesOpened={profile.boxesOpened}
          onAwarded={loadAll}
        />
        <SpinWheel code={profile.referralCode} tickets={profile.spinTickets} onSpin={loadAll} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WalletPanel wallet={wallet} />
        <LeaderboardPanel entries={board} />
      </div>

      <button
        onClick={loadAll}
        className="text-xs text-white/50 underline underline-offset-4 hover:text-[#D4AF37]"
      >
        Refresh
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between text-white/50">
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
        <span className="text-[#D4AF37]">{icon}</span>
      </div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
    </div>
  );
}
