export default function ReferralProgressBar({
  completed,
  milestone,
  need,
}: {
  completed: number;
  milestone: number;
  need: number;
}) {
  const pct = Math.min(100, Math.round((completed / milestone) * 100));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center justify-between text-sm text-white/70">
        <span className="font-medium">Referral Progress</span>
        <span className="font-mono text-[#D4AF37]">
          {completed} / {milestone}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-yellow-200 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-white/50">
        {need > 0
          ? `Need ${need} more referral${need > 1 ? 's' : ''} to unlock a mystery box`
          : 'Milestone reached — open your mystery box!'}
      </p>
    </div>
  );
}
