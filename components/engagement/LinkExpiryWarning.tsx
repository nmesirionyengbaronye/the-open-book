'use client';

import { AlertTriangle, Share2 } from 'lucide-react';
import { isLinkExpiringSoon, isLinkExpired } from '@/lib/engagement';

export default function LinkExpiryWarning({
  expiresAt,
  onShare,
}: {
  expiresAt: Date | null;
  onShare?: () => void;
}) {
  if (!expiresAt) return null;

  if (isLinkExpired(expiresAt)) {
    return (
      <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
        <div className="flex items-center gap-2 text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Your referral link has expired</span>
        </div>
        <p className="mt-1 text-[11px] text-red-300/80">
          Generate a new link from your dashboard to keep earning rewards.
        </p>
      </div>
    );
  }

  if (isLinkExpiringSoon(expiresAt)) {
    const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (
      <div className="mt-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3">
        <div className="flex items-center gap-2 text-orange-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Link expiring in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
        </div>
        <p className="mt-1 text-[11px] text-orange-300/80">
          Share your link soon to keep earning referrals.
        </p>
        {onShare && (
          <button
            onClick={onShare}
            className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1.5 text-[11px] font-medium text-orange-300 hover:bg-orange-500/30"
          >
            <Share2 className="h-3 w-3" /> Share now
          </button>
        )}
      </div>
    );
  }

  return null;
}
