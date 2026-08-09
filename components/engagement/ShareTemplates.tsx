'use client';

import { useCallback, useEffect, useState } from 'react';
import { Share2, Trophy, Users, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const templates = {
  whatsapp: (code: string, name: string) =>
    `Hey! I'm joining the UniUI waitlist and I thought you might want in too. Use my link to get early access: https://uniuiapp.com/r/${code} — ${name}`,
  instagram: (code: string) =>
    `Early access unlocked 🎟️ Join me on the UniUI waitlist and let's both move up faster:\nhttps://uniuiapp.com/r/${code}`,
  twitter: (code: string) =>
    `I just joined the UniUI waitlist. If you’re a student who hates clunky school tools, you’ll want in too:\nhttps://uniuiapp.com/r/${code}`,
};

export default function ShareTemplates({ code, fullName }: { code: string; fullName: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error('Could not copy');
    }
  }, []);

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        <Share2 className="h-4 w-4" />
        <h3 className="text-sm font-semibold tracking-wide">Share templates</h3>
      </div>
      <div className="mt-2 space-y-2">
        {Object.entries(templates).map(([key, template]) => (
          <div
            key={key}
            className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <p className="text-[11px] leading-relaxed text-white/70">{template(code, fullName)}</p>
            <button
              onClick={() => copy(template(code, fullName), key)}
              className="shrink-0 rounded-full bg-white/10 p-2 text-white/70 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]"
            >
              {copied === key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
