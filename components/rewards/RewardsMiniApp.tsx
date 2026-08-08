'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, PhoneCall, Gift, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import RewardsHub from './RewardsHub';
import MiniJoin from './MiniJoin';

type Phase = 'loading' | 'blocked' | 'verify' | 'notfound' | 'rules' | 'dashboard';

declare global {
  interface Window {
    Telegram?: { WebApp?: any };
  }
}

const RULES = [
  'Every 7 verified referrals unlock 1 spin — unlimited.',
  'Each spin pays out cash to your wallet instantly.',
  'Spin prizes are random and range from ₦200 to ₦10,000.',
  'One account per person. Fraud or fake referrals get you disqualified.',
  'UniUI may modify or end the giveaway at any time.',
];

export default function RewardsMiniApp() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [code, setCode] = useState('');
  const [tg, setTg] = useState<any>(null);
  const [requesting, setRequesting] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('Share your Telegram number to unlock your rewards.');
  const [agreed, setAgreed] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verifyingRef = useRef(false);

  // Wait for the Telegram WebApp session. Outside a real Mini App we block.
  useEffect(() => {
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const tw = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
      if (tw && tw.initData) {
        try {
          tw.ready();
          tw.expand();
          tw.setHeaderColor?.('#0A0A0F');
          tw.setBackgroundColor?.('#0A0A0F');
        } catch {
          /* noop */
        }
        setTg(tw);
        setPhase('verify');
        return;
      }
      if (tries++ < 25) {
        timer = setTimeout(check, 150);
      } else {
        setPhase('blocked');
      }
    };
    check();
    return () => clearTimeout(timer);
  }, []);

  async function doVerify(attempt = 0) {
    const initData = tg?.initData || '';
    if (!initData) {
      verifyingRef.current = false;
      toast.error('Missing Telegram session');
      setRequesting(false);
      return;
    }
    try {
      const res = await fetch('/api/rewards/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      if (data.reason === 'contact_pending') {
        if (attempt < 15) {
          pollRef.current = setTimeout(() => doVerify(attempt + 1), 1000);
          return;
        }
        verifyingRef.current = false;
        setRequesting(false);
        setVerifyMsg('Still waiting for your contact from Telegram. Tap Share and choose Allow, then try again.');
        return;
      }
      if (!res.ok) {
        verifyingRef.current = false;
        if (data.reason === 'not_on_waitlist') {
          setPhase('notfound');
        } else if (
          ['contact_required', 'contact_mismatch', 'invalid_phone', 'invalid_session'].includes(data.reason)
        ) {
          setRequesting(false);
          setVerifyMsg(data.error || 'Please share your Telegram contact to verify.');
        } else {
          toast.error(data.error || 'Verification failed');
          setRequesting(false);
        }
        return;
      }
      verifyingRef.current = false;
      setCode(data.profile.referralCode);
      let accepted = false;
      try {
        accepted = localStorage.getItem('uniui_rewards_rules') === '1';
      } catch {
        /* noop */
      }
      setPhase(accepted ? 'dashboard' : 'rules');
    } catch {
      if (attempt < 3) {
        pollRef.current = setTimeout(() => doVerify(attempt + 1), 1500);
        return;
      }
      verifyingRef.current = false;
      toast.error('Verification failed');
      setRequesting(false);
    }
  }

  function startVerify() {
    if (verifyingRef.current) return;
    verifyingRef.current = true;
    setRequesting(true);
    doVerify(0);
  }

  useEffect(() => {
    if (!tg) return;
    const handler = () => startVerify();
    tg.onEvent?.('contactRequested', handler);
    return () => {
      tg.offEvent?.('contactRequested', handler);
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [tg]);

  function shareContact() {
    if (!tg) return;
    setRequesting(true);
    setVerifyMsg('Tap “Allow” in Telegram to share your number. We use it only to match your waitlist account — it can’t be faked.');
    try {
      tg.requestContact(() => startVerify());
    } catch {
      setRequesting(false);
      setVerifyMsg('Contact sharing isn’t available here. Open the app from Telegram and tap Share.');
    }
  }

  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (phase === 'blocked') {
    const bot = process.env.NEXT_PUBLIC_BOT_USERNAME || 'UniUIRewardsBot';
    const link = `https://t.me/${bot.replace(/^@/, '')}`;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#D4AF37]" />
        <h1 className="text-xl font-semibold">UniUI Rewards</h1>
        <p className="mt-2 max-w-sm text-sm text-white/60">Opening in Telegram…</p>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-6 rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-black"
        >
          Open in Telegram
        </a>
      </div>
    );
  }

  if (phase === 'dashboard') {
    return <RewardsHub code={code} inTelegram={!!tg} />;
  }

  if (phase === 'rules') {
    return (
      <div className="mx-auto w-full max-w-lg px-4 pb-12 pt-6 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-white/[0.04] p-6">
          <div className="mb-4 flex items-center gap-2 text-[#D4AF37]">
            <ShieldCheck className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Giveaway rules</h1>
          </div>
          <ul className="space-y-3">
            {RULES.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/70">
                <span className="mt-0.5 text-[#D4AF37]">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#D4AF37]"
            />
            <span className="text-sm text-white/80">I have read and agree to the giveaway rules.</span>
          </label>

          <button
            onClick={() => {
              try {
                localStorage.setItem('uniui_rewards_rules', '1');
              } catch {
                /* noop */
              }
              setPhase('dashboard');
            }}
            disabled={!agreed}
            className="mt-4 w-full rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // verify or notfound
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/30 bg-white/5 p-6 text-center">
        <Gift className="mx-auto mb-3 h-9 w-9 text-[#D4AF37]" />
        <h1 className="text-lg font-semibold">Welcome to UniUI Rewards</h1>
        <p className="mt-2 text-sm text-white/60">{verifyMsg}</p>

        {phase === 'notfound' ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-300">
            <AlertTriangle className="h-4 w-4" /> You’re not on the UniUI Waitlist with this Telegram number.
          </div>
        ) : (
          <button
            onClick={shareContact}
            disabled={requesting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black disabled:opacity-60"
          >
            {requesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PhoneCall className="h-4 w-4" />}
            Share Phone Number
          </button>
        )}

        <p className="mt-3 text-[10px] text-white/40">
          We match your verified Telegram number to your UniUI waitlist account — no password needed.
        </p>
      </div>

      {phase === 'notfound' && (
        <div className="w-full max-w-sm">
          <MiniJoin onJoined={() => { setPhase('verify'); startVerify(); }} />
        </div>
      )}
    </div>
  );
}
