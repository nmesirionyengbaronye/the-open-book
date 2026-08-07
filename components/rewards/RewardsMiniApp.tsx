'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, PhoneCall, Gift, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import RewardsHub from './RewardsHub';

type Phase = 'loading' | 'blocked' | 'verify' | 'notfound' | 'dashboard';

declare global {
  interface Window {
    Telegram?: { WebApp?: any };
  }
}

export default function RewardsMiniApp() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [code, setCode] = useState('');
  const [tg, setTg] = useState<any>(null);
  const [requesting, setRequesting] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('Share your Telegram number to unlock your rewards.');
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

  // Re-run verification. The server resolves the REAL phone from the bot-
  // delivered contact (webhook -> DB); it returns `contact_pending` until that
  // arrives, and we retry. The client never supplies or sees the raw number.
  async function doVerify(attempt = 0) {
    // Read the LATEST initData on every attempt: after the user shares their
    // contact, Telegram re-signs initData to include it (trusted, server-side
    // verified). If it's not present yet, the server falls back to the
    // bot-stored contact (webhook) and returns contact_pending for us to retry.
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
      // contact_pending is returned with HTTP 202 (res.ok is true), so it must
      // be handled before the status check — the bot→webhook→DB delivery of
      // the shared contact may still be in flight.
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
      setPhase('dashboard');
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

  // verify or notfound
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/30 bg-white/5 p-6 text-center">
        <Gift className="mx-auto mb-3 h-9 w-9 text-[#D4AF37]" />
        <h1 className="text-lg font-semibold">Welcome to UniUI Rewards</h1>
        <p className="mt-2 text-sm text-white/60">{verifyMsg}</p>

        {phase === 'notfound' ? (
          <>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-300">
              <AlertTriangle className="h-4 w-4" /> You’re not on the UniUI Waitlist with this Telegram number.
            </div>
            <a
              href="https://waitlist.uniui.com.ng"
              target="_blank"
              rel="noreferrer"
              className="mt-4 block rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-black"
            >
              Join Waitlist
            </a>
          </>
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
    </div>
  );
}
