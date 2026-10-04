'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Loader2,
  AlertCircle,
  Gift,
  Trophy,
  Users,
  Wallet,
  Sparkles,
  Copy,
  Check,
  BadgeCheck,
  RotateCw,
  PackageOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { MILESTONE } from '@/lib/referral-counts';
import ReferralProgressBar from './ReferralProgressBar';
import MysteryBox from './MysteryBox';
import SpinWheel from './SpinWheel';
import WalletPanel from './WalletPanel';
import LeaderboardPanel from './LeaderboardPanel';
import MusicPlayer from './MusicPlayer';
import StreakDisplay from '../engagement/StreakDisplay';
import BadgeShowcase from '../engagement/BadgeShowcase';
import ShareTemplates from '../engagement/ShareTemplates';
import GroupChallenge from '../engagement/GroupChallenge';
import LinkExpiryWarning from '../engagement/LinkExpiryWarning';
import MilestoneCertificate from '../engagement/MilestoneCertificate';
import ConfettiCelebration from '../engagement/ConfettiCelebration';
import type { RewardsProfile, ReferralsResponse, LeaderboardEntry, WalletInfo } from './types';

export default function RewardsHub({
  code,
  inTelegram = false,
  autoPlayMusic = false,
}: {
  code: string;
  inTelegram?: boolean;
  autoPlayMusic?: boolean;
}) {
  const [profile, setProfile] = useState<RewardsProfile | null>(null);
  const [referrals, setReferrals] = useState<ReferralsResponse | null>(null);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [winners, setWinners] = useState<{ name: string; winnings: number; referrals: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [engagement, setEngagement] = useState<{
    streak: { current: number; longest: number };
    badges: { key: string; label: string; emoji: string; color: string }[];
    celebrations: number[];
    nextMilestone: number;
    need: number;
  } | null>(null);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/engagement?code=${encodeURIComponent(code)}`)
      .then((x) => (x.ok ? x.json() : null))
      .then(setEngagement)
      .catch(() => {});
  }, [code]);

  const loadAll = useCallback(async () => {
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const [p, r, l, w, win] = await Promise.all([
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
        fetch(`/api/rewards/winners`).then((x) => (x.ok ? x.json() : [])),
      ]);
      setProfile(p);
      setReferrals(r);
      setBoard(l);
      setWallet(w);
      setWinners(win);
    } catch (e: any) {
      setError(e?.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const copyCode = async () => {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      toast.success('Referral code copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 pt-12 text-center text-black/70 [padding-top:max(3rem,env(safe-area-inset-top))]">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-black" />
        <p className="mt-3 text-sm text-black">Loading your rewards…</p>
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 pt-12 [padding-top:max(3rem,env(safe-area-inset-top))]">
        <div className="rounded-2xl border border-red-600/30 bg-red-600/10 p-6 text-center text-sm text-red-600">
          <AlertCircle className="mx-auto mb-2 h-6 w-6" />
          {error || 'Rewards unavailable'}
          <button
            onClick={loadAll}
            className="mt-4 block w-full rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-[#FFD93D]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const firstName = (profile.fullName || '').split(' ')[0] || 'there';

  return (
    <div className={`mx-auto w-full max-w-lg px-4 pb-12 [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))] ${
      inTelegram ? 'pt-[25vh]' : 'pt-4 [padding-top:max(1rem,env(safe-area-inset-top))]'
    }`}>
      {!inTelegram && (
        <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-black text-[#FFD93D] text-sm font-bold">
                U
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-black">UniUI Rewards</div>
                <div className="text-[10px] uppercase tracking-widest text-black/60">Student giveaway</div>
              </div>
            </div>
            <button
              onClick={loadAll}
              aria-label="Refresh"
              className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-black/5 text-black/70 transition hover:text-black"
            >
              <RotateCw className="h-4 w-4" />
            </button>
        </div>
      )}

      {/* Identity / hero */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-black/10 bg-black/5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-black/70">Welcome back</div>
            <div className="text-2xl font-bold text-black">{firstName} 👋</div>
          </div>
          {profile.telegramVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2.5 py-1 text-[11px] font-medium text-black">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified
            </span>
          ) : (
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] text-black/70">Unverified</span>
          )}
        </div>

        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-widest text-black/80">Your referral code</div>
          <button
            onClick={copyCode}
            className="group mt-1 flex w-full items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-left transition hover:border-black/40"
          >
            <span className="font-mono text-lg font-semibold tracking-wider text-black">
              {profile.referralCode}
            </span>
            {copied ? (
              <Check className="h-4 w-4 text-black" />
            ) : (
              <Copy className="h-4 w-4 text-black/60 transition group-hover:text-black" />
            )}
          </button>
          <p className="mt-2 text-[11px] text-black/70">
            Share this code to earn referrals and unlock rewards.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Verified referrals" value={String(profile.effectiveReferrals)} icon={<Gift className="h-4 w-4" />} />
        <Stat label="Joined via link" value={String(profile.joinedCount)} icon={<Users className="h-4 w-4" />} />
        <Stat label="Rank" value={profile.rank ? `#${profile.rank}` : '—'} icon={<Trophy className="h-4 w-4" />} />
        <Stat label="Spin tickets" value={String(profile.spinTickets)} icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Cash wallet" value={`₦${profile.walletBalance.toLocaleString()}`} icon={<Wallet className="h-4 w-4" />} />
        <Stat label="Launch tokens" value={String(profile.launchTokens)} icon={<BadgeCheck className="h-4 w-4" />} />
        <Stat label="Boxes due" value={String(profile.boxesDue)} icon={<PackageOpen className="h-4 w-4" />} />
        <Stat label="Boxes opened" value={String(profile.boxesOpened)} icon={<Gift className="h-4 w-4" />} />
      </div>

      {profile.disqualified && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          This account has been disqualified from the giveaway.
        </div>
      )}

      {/* Engagement */}
      {engagement && (
        <>
          <div className="mt-4">
            <StreakDisplay current={engagement.streak.current} longest={engagement.streak.longest} />
          </div>
          <div className="mt-4">
            <BadgeShowcase
              profile={profile}
              badges={engagement.badges}
              celebrations={engagement.celebrations}
              onShare={() => setCopied(true)}
            />
          </div>
          <div className="mt-4">
            <GroupChallenge current={profile.effectiveReferrals} target={engagement.nextMilestone * MILESTONE} reward={`${engagement.nextMilestone} box + ${engagement.nextMilestone} spin`} />
          </div>
          {profile.referralLinkExpiresAt && (
            <LinkExpiryWarning
              expiresAt={new Date(profile.referralLinkExpiresAt)}
              onShare={() => {
                navigator.clipboard.writeText(`${window.location.origin}/join?ref=${profile.referralCode}`);
                toast.success('Link copied');
              }}
            />
          )}
          <div className="mt-4">
            <ShareTemplates code={profile.referralCode} fullName={profile.fullName} />
          </div>
        </>
      )}

      {/* Referral progress */}
      <SectionTitle icon={<Gift className="h-4 w-4" />} title="Referral progress" />
      <div className="mt-2 space-y-3">
        <div className="rounded-xl border border-black/10 bg-black/5 p-4">
          <div className="text-xs text-black/70 mb-2">
            Verified referrals unlock boxes and spins. Pending referrals don’t count until they verify.
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.max(5, Math.ceil((profile.effectiveReferrals || 0) / MILESTONE) + 3) }).map((_, i) => {
              const milestone = (i + 1) * MILESTONE;
              const unlocked = (profile.effectiveReferrals || 0) >= milestone;
              const isNext = !unlocked && i === Math.floor((profile.effectiveReferrals || 0) / MILESTONE);
              return (
                <div
                  key={milestone}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border ${
                    unlocked
                      ? 'bg-black/10 border-black/30 text-black'
                      : isNext
                        ? 'bg-black/5 border-black/20 text-black'
                        : 'bg-black/5 border-black/10 text-black/60'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
                    unlocked ? 'bg-black text-[#FFD93D]' : 'bg-black/10 text-black/60'
                  }`}>
                    {unlocked ? '✓' : i + 1}
                  </span>
                  {milestone} = {(i + 1)} box{(i + 1) === 1 ? '' : 'es'} + {(i + 1)} spin{(i + 1) === 1 ? '' : 's'}
                </div>
              );
            })}
          </div>
        </div>

        <ReferralProgressBar
          completed={referrals?.progress.completed ?? 0}
          milestone={referrals?.progress.milestone ?? 7}
          need={referrals?.progress.need ?? 0}
        />
      </div>

      {/* Recent joins — shows people who joined via this user's link */}
      <div className="mt-5">
        <SectionTitle icon={<Users className="h-4 w-4" />} title="Recent joins" />
        {referrals?.referrals?.length ? (
          <ul className="mt-2 space-y-2">
            {referrals.referrals.slice(0, 8).map((rf, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl border border-black/10 bg-black/5 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-black">{rf.name}</div>
                  <div className="text-[11px] text-black/60">
                    Joined {new Date(rf.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                    rf.status === 'verified'
                      ? 'bg-black/10 text-black'
                      : 'bg-black/5 text-black/70'
                  }`}
                >
                  {rf.status === 'verified' ? 'Verified' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[11px] text-black/70">No referrals yet — share your code to start.</p>
        )}
      </div>

      {/* Game row — stacked so the larger wheel has room on narrow phones */}
      <div className="mt-5 grid gap-4">
        <MysteryBox
          code={profile.referralCode}
          boxesDue={profile.boxesDue}
          boxesOpened={profile.boxesOpened}
          onAwarded={loadAll}
        />
        <SpinWheel code={profile.referralCode} tickets={profile.spinTickets} onSpin={loadAll} />
      </div>

      {/* Info row */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <WalletPanel wallet={wallet} />
        <LeaderboardPanel entries={board} />
      </div>

      {/* Recent winners */}
      {winners.length > 0 && (
        <div className="mt-5">
          <SectionTitle icon={<Trophy className="h-4 w-4" />} title="Recent winners" />
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {winners.slice(0, 6).map((wn, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/5 px-4 py-2.5"
              >
                 <div className="min-w-0">
                   <div className="truncate text-sm font-medium text-black">{wn.name}</div>
                   <div className="text-[10px] text-black/60">{wn.referrals} verified referrals</div>
                 </div>
                <div className="ml-2 shrink-0 font-mono text-sm font-semibold text-black">
                  ₦{wn.winnings.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfettiCelebration trigger={celebrationTrigger} />
      <MusicPlayer autoPlay={autoPlayMusic} />
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mt-6 flex items-center gap-2 text-black">
      {icon}
      <h3 className="text-sm font-semibold tracking-wide text-black">{title}</h3>
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
    <div className="rounded-2xl border border-black/10 bg-black/5 p-3.5">
      <div className="flex items-center justify-between text-black/70">
        <span className="text-[9px] uppercase tracking-widest">{label}</span>
        <span className="text-black">{icon}</span>
      </div>
      <div className="mt-1.5 text-lg font-bold text-black">{value}</div>
    </div>
  );
}
