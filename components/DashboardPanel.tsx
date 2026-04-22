"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChapterProgress {
  chapterNumber: number;
  chapterTitle: string;
  novelTitle: string;
  bestWpm: number;
  bestAccuracy: number;
  completedAt: string | null;
}

interface RecentAttempt {
  createdAt: string;
  chapterTitle: string;
  novelTitle: string;
  wpm: number;
  accuracy: number;
}

interface ProgressSummary {
  totalAttempts: number;
  totalCompletedChapters: number;
  averageWpm: number;
  averageAccuracy: number;
  chapterProgress: ChapterProgress[];
  recentAttempts: RecentAttempt[];
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

export function DashboardPanel() {
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/progress", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const payload = (await response.json()) as { progress: ProgressSummary };
        setProgress(payload.progress);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const trendSeries = useMemo(() => {
    return (progress?.recentAttempts ?? [])
      .slice()
      .reverse()
      .map((attempt, index) => ({
        run: index + 1,
        wpm: attempt.wpm,
        accuracy: attempt.accuracy,
      }));
  }, [progress?.recentAttempts]);

  const chapterSeries = useMemo(() => {
    return (progress?.chapterProgress ?? [])
      .slice(0, 12)
      .map((chapter) => ({
        chapter: `${chapter.novelTitle.split(" ")[0]} ${chapter.chapterNumber}`,
        bestWpm: chapter.bestWpm,
      }));
  }, [progress?.chapterProgress]);

  if (loading) {
    return <p className="text-slate-300">Loading your progress...</p>;
  }

  if (!progress) {
    return (
      <p className="text-slate-300">
        We could not load your progress yet. Complete a practice attempt and refresh.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Average WPM"
          value={progress.averageWpm.toFixed(1)}
          hint="Across all saved attempts"
        />
        <Stat
          label="Average Accuracy"
          value={`${progress.averageAccuracy.toFixed(1)}%`}
          hint="Precision over speed"
        />
        <Stat
          label="Attempts"
          value={`${progress.totalAttempts}`}
          hint="Completed passage runs"
        />
        <Stat
          label="Chapters Completed"
          value={`${progress.totalCompletedChapters}`}
          hint="Unlock progress across books"
        />
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Recent Performance Trend</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <LineChart data={trendSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="run" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 10,
                }}
              />
              <Line type="monotone" dataKey="wpm" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Best WPM by Chapter</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={chapterSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="chapter" stroke="#94a3b8" interval={0} angle={-20} textAnchor="end" height={56} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 10,
                }}
              />
              <Bar dataKey="bestWpm" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
