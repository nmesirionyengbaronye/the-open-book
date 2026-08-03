'use client';

import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';

interface ShareCardProps {
  name: string;
  referralCode: string;
  position: number;
  referralCount: number;
  url: string;
  institution?: string;
  department?: string;
}

export function ShareCard({ name, referralCode, position, referralCount, url, institution, department }: ShareCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, { width: 160, margin: 1, color: { dark: '#0A0A0F', light: '#D4AF37' } })
      .then((dataUrl) => { if (!cancelled) setQrDataUrl(dataUrl); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [url]);

  const exportPng = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
      const link = document.createElement('a');
      link.download = `uniui-${referralCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to export share card:', e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={ref}
        className="w-full max-w-lg mx-auto rounded-3xl border border-gold/50 bg-[#0A0A0F] p-8 text-white shadow-[0_25px_80px_-15px_rgba(212,175,55,0.35)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold/90">Uni UI Waitlist</div>
            <div className="mt-2 text-3xl font-display font-bold leading-tight">{name}</div>
            <div className="mt-1 text-sm text-white/70">{institution}</div>
            <div className="text-sm text-white/60">{department}</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-display font-bold text-gold">#{position}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">Position</div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-5 rounded-2xl bg-white/5 p-5 border border-white/10">
          {qrDataUrl && (
            <img src={qrDataUrl} alt="Referral QR" className="w-28 h-28 rounded-xl" />
          )}
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Referral code</div>
            <div className="font-mono text-base text-gold break-all">{referralCode}</div>
            <div className="mt-2 text-[11px] text-white/60 break-all leading-relaxed">{url}</div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-white/60">
          <span>Referrals: {referralCount}</span>
          <span>Join with my link</span>
        </div>
      </div>

      <button
        onClick={exportPng}
        disabled={exporting}
        className="mx-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold text-background text-sm font-semibold gold-glow-hover disabled:opacity-60"
      >
        <Download className="w-4 h-4" />
        {exporting ? 'Exporting…' : 'Download share card'}
      </button>
    </div>
  );
}
