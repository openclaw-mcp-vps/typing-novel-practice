interface ProgressStatsProps {
  wpm: number;
  accuracy: number;
  mistakes: number;
  elapsedMs: number;
  bestWpm: number;
  bestAccuracy: number;
}

function formatDuration(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

export function ProgressStats({
  wpm,
  accuracy,
  mistakes,
  elapsedMs,
  bestWpm,
  bestAccuracy,
}: ProgressStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Live WPM"
        value={`${wpm.toFixed(1)}`}
        hint={`Personal best ${bestWpm.toFixed(1)} WPM`}
      />
      <StatCard
        label="Accuracy"
        value={`${accuracy.toFixed(1)}%`}
        hint={`Best on this chapter ${bestAccuracy.toFixed(1)}%`}
      />
      <StatCard
        label="Mistakes"
        value={`${mistakes}`}
        hint="Mismatched characters this attempt"
      />
      <StatCard
        label="Time"
        value={formatDuration(elapsedMs)}
        hint="Steady pacing beats frantic bursts"
      />
    </div>
  );
}
