import type { WalletInfo } from './types';

export default function WalletPanel({ wallet }: { wallet: WalletInfo | null }) {
  if (!wallet) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
        Wallet information unavailable.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-3 text-sm font-semibold text-white/80">Wallet</h3>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-white/50">Balance</p>
          <p className="font-mono text-lg text-[#D4AF37]">₦{wallet.balance}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-white/50">Pending</p>
          <p className="font-mono text-lg text-white/80">₦{wallet.pending}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-white/50">Paid</p>
          <p className="font-mono text-lg text-green-400">₦{wallet.paid}</p>
        </div>
      </div>
      {wallet.history.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-white/50">Spin history</p>
          <ul className="space-y-1 text-xs text-white/70">
            {wallet.history.slice(0, 8).map((h, i) => (
              <li key={i} className="flex justify-between border-b border-white/5 pb-1">
                <span>₦{h.prize}</span>
                <span className={h.paid ? 'text-green-400' : 'text-white/40'}>
                  {h.paid ? 'Paid' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
