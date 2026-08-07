'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!tg) return;
    const handler = (event: any) => {
      const contact = event?.contact || window.Telegram?.WebApp?.initDataUnsafe?.contact;
      const phone = contact?.phone_number;
      if (!phone) {
        setRequesting(false);
        toast.error('Could not read your contact. Please try again.');
        return;
      }
      doVerify(String(phone));
    };
    tg.onEvent?.('contactRequested', handler);
    return () => tg.offEvent?.('contactRequested', handler);
  }, [tg]);

  useEffect(() => {
    if (phase !== 'blocked') return;
    const bot = process.env.NEXT_PUBLIC_BOT_USERNAME || 'UniUIRewardsBot';
    const link = `https://t.me/${bot.replace(/^@/, '')}`;
    window.location.href = link;
  }, [phase]);

  async function doVerify(phone: string) {
    const initData = tg?.initData;
    if (!initData) {
      setRequesting(false);
      toast.error('Missing Telegram session');
      return;
    }
    try {
      const res = await fetch('/api/rewards/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.reason === 'not_on_waitlist') {
          setPhase('notfound');
        } else {
          toast.error(data.error || 'Verification failed');
        }
        setRequesting(false);
        return;
      }
      setCode(data.profile.referralCode);
      setPhase('dashboard');
    } catch {
      toast.error('Verification failed');
      setRequesting(false);
    }
  }

  function shareContact() {
    if (!tg) return;
    setRequesting(true);
    try {
      tg.requestContact();
    } catch {
      setRequesting(false);
      toast.error('Contact sharing is only available inside Telegram.');
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
    return <RewardsHub code={code} />;
  }

  // verify or notfound
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/30 bg-white/5 p-6 text-center">
        <Gift className="mx-auto mb-3 h-9 w-9 text-[#D4AF37]" />
        <h1 className="text-lg font-semibold">Welcome to UniUI Rewards</h1>
        <p className="mt-2 text-sm text-white/60">
          Please verify your account to continue.
        </p>

        {phase === 'notfound' ? (
          <>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-300">
              <AlertTriangle className="h-4 w-4" /> You&apos;re not on the UniUI Waitlist.
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
            {requesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PhoneCall className="h-4 w-4" />
            )}
            Share Phone Number
          </button>
        )}
        <p className="mt-3 text-[10px] text-white/40">
          We use Telegram&apos;s secure contact share — no manual typing.
        </p>
      </div>
    </div>
  );
}
