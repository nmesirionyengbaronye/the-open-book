'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, PhoneCall, Gift, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import RewardsHub from './RewardsHub';
import MiniJoin from './MiniJoin';
import { GIVEAWAY_RULES } from '@/lib/rules';

type Phase = 'loading' | 'blocked' | 'verify' | 'notfound' | 'rules' | 'dashboard';

declare global {
  interface Window {
    Telegram?: { WebApp?: any };
  }
}

// Shared with the web dashboard gate — see lib/rules.ts
const RULES = GIVEAWAY_RULES;

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
      const inTelegram =
        typeof window !== 'undefined' &&
        (!!(window as any).Telegram?.WebApp ||
          /Telegram/i.test(navigator.userAgent) ||
          !!document.querySelector('script[src*="telegram-web-app.js"]'));
      if (inTelegram) {
        const tw = (window as any).Telegram?.WebApp;
        if (tw) {
          try {
            tw.ready();
            tw.expand();
            tw.setHeaderColor?.('#0A0A0F');
            tw.setBackgroundColor?.('#0A0A0F');
          } catch {
            /* noop */
          }
          setTg(tw);
        }
        setPhase('verify');
        return;
      }
      if (tries++ < 80) {
        timer = setTimeout(check, 250);
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
      return;
    }
    // Fallback: start verification immediately; server will ask for retry if contact is still in flight.
    startVerify();
  }

  if (phase === 'loading') {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-start pt-[25vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (phase === 'blocked') {
    const bot = process.env.NEXT_PUBLIC_BOT_USERNAME || 'UniUIRewardsBot';
    const botLink = `https://t.me/${bot.replace(/^@/, '')}`;

    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-start px-6 pt-[25vh] text-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#D4AF37]" />
        <h1 className="text-xl font-semibold">UniUI Rewards</h1>
        <p className="mt-2 max-w-sm text-sm text-white/60">
          This page only works inside Telegram. Open the bot below to access your rewards.
        </p>
        <a
          href={botLink}
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
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4 pb-6 [padding-top:max(25vh,env(safe-area-inset-top))] [padding-bottom:max(1.5rem,env(safe-area-inset-bottom))]">
        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2">
          <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1 text-[11px] font-medium text-[#D4AF37]">
            Step 2 of 2
          </span>
          <span className="text-[11px] text-white/40">Review the rules</span>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />
          <h1 className="text-xl font-bold text-white">Giveaway rules</h1>
        </div>
        <p className="mb-5 text-sm text-white/50">
          Please read these rules carefully. You must agree before you can claim rewards.
        </p>

        <ul className="flex-1 space-y-3 overflow-y-auto pr-1">
          {RULES.map((r, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#D4AF37]/15 text-[11px] font-bold text-[#D4AF37]">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-white/75">{r}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <label className="mb-3 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-5 w-5 accent-[#D4AF37]"
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
            className="w-full rounded-full bg-[#D4AF37] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // verify or notfound
  if (phase === 'notfound') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/30 bg-white/5 p-6 text-center">
          <Gift className="mx-auto mb-3 h-9 w-9 text-[#D4AF37]" />
          <h1 className="text-lg font-semibold">Join UniUI first</h1>
          <p className="mt-2 text-sm text-white/60">
            This Telegram number isn’t on the waitlist yet. Join now and we’ll verify you immediately.
          </p>
          <MiniJoin onJoined={() => { setPhase('verify'); startVerify(); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/30 bg-white/5 p-6 text-center">
        <Gift className="mx-auto mb-3 h-9 w-9 text-[#D4AF37]" />
        <h1 className="text-lg font-semibold">Welcome to UniUI Rewards</h1>
        <p className="mt-2 text-sm text-white/60">{verifyMsg}</p>

        <button
          onClick={shareContact}
          disabled={requesting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black disabled:opacity-60"
        >
          {requesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PhoneCall className="h-4 w-4" />}
          Share Phone Number
        </button>
      </div>
    </div>
  );
}
