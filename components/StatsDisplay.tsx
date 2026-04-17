import { Activity, Gauge, Target, Timer } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { formatTime, type TypingStats } from "@/lib/typing-stats";

interface StatsDisplayProps {
  stats: TypingStats;
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="rounded-xl border bg-[var(--surface)] p-4">
      <div className="mb-3 text-sm font-medium text-[var(--muted)]">Live Performance</div>
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-lg border bg-[var(--surface-muted)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--muted)]">
            <Gauge className="h-3.5 w-3.5" />
            Net WPM
          </div>
          <div className="text-xl font-bold">{stats.netWpm}</div>
        </div>

        <div className="rounded-lg border bg-[var(--surface-muted)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--muted)]">
            <Activity className="h-3.5 w-3.5" />
            Gross WPM
          </div>
          <div className="text-xl font-bold">{stats.grossWpm}</div>
        </div>

        <div className="rounded-lg border bg-[var(--surface-muted)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--muted)]">
            <Target className="h-3.5 w-3.5" />
            Accuracy
          </div>
          <div className="text-xl font-bold">{stats.accuracy}%</div>
        </div>

        <div className="rounded-lg border bg-[var(--surface-muted)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--muted)]">
            <Timer className="h-3.5 w-3.5" />
            Time
          </div>
          <div className="text-xl font-bold">{formatTime(stats.elapsedSeconds)}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Accuracy Trend</span>
          <span>{stats.accuracy}%</span>
        </div>
        <Progress value={stats.accuracy} />
      </div>
    </div>
  );
}
