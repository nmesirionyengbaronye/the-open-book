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
}

export function ShareCard({ name, referralCode, position, referralCount, url }: ShareCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, { width: 120, margin: 1, color: { dark: '#0A0A0F', light: '#D4AF37' } })
      .then((dataUrl) => { if (!cancelled) setQrDataUrl(dataUrl); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [url]);

  const exportPng = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
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
        className="w-full max-w-sm mx-auto rounded-2xl border border-gold/40 bg-[#0A0A0F] p-6 text-white shadow-[0_20px_60px_-15px_rgba(212,175,55,0.25)]"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold/80">Uni UI Waitlist</div>
            <div className="mt-1 text-xl font-display font-bold">{name.split(' ')[0]}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-gold">#{position}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/60">Position</div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-xl bg-white/5 p-4 border border-white/10">
          {qrDataUrl && (
            <img src={qrDataUrl} alt="Referral QR" className="w-24 h-24 rounded-lg" />
          )}
          <div className="min-w-0">
            <div className="text-xs text-white/70">Referral code</div>
            <div className="mt-1 font-mono text-sm text-gold break-all">{referralCode}</div>
            <div className="mt-2 text-[11px] text-white/60 break-all">{url}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <span>Referrals: {referralCount}</span>
          <span>Join with my link</span>
        </div>
      </div>

      <button
        onClick={exportPng}
        disabled={exporting}
        className="mx-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-background text-sm font-semibold gold-glow-hover disabled:opacity-60"
      >
        <Download className="w-4 h-4" />
        {exporting ? 'Exporting…' : 'Download share card'}
      </button>
    </div>
  );
}
