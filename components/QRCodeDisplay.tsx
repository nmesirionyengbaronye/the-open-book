'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  title?: string;
}

export function QRCodeDisplay({ url, size = 220, title = 'Scan to join' }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 2,
      color: {
        dark: '#0A0A0F',
        light: '#D4AF37',
      },
    }).catch(() => {
      if (!cancelled) setError(true);
    });
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `uniui-referral-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-gold/20 flex flex-col items-center gap-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
      <div className="rounded-xl overflow-hidden border border-gold/30 bg-gold/5 p-3">
        {error ? (
          <div className="w-[220px] h-[220px] flex items-center justify-center text-xs text-muted-foreground">
            Failed to generate QR code
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full" />
        )}
      </div>
      <div className="flex gap-2 w-full">
        <button
          onClick={download}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-background text-sm font-semibold gold-glow-hover"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        <button
          onClick={copyLink}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg glass border-gold/40 text-gold text-sm font-medium hover:bg-gold/10"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
