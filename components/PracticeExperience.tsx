"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { NovelSelector } from "@/components/NovelSelector";
import { StatsDisplay } from "@/components/StatsDisplay";
import { TypingInterface } from "@/components/TypingInterface";
import { Button } from "@/components/ui/button";
import { novels } from "@/lib/novels";
import { calculateTypingStats, type TypingStats } from "@/lib/typing-stats";

interface PracticeExperienceProps {
  initialNovelId?: string;
  initialChapterId?: string;
}

export function PracticeExperience({ initialNovelId, initialChapterId }: PracticeExperienceProps) {
  const router = useRouter();
  const firstNovel = novels.find((novel) => novel.id === initialNovelId) ?? novels[0];
  const firstChapter = firstNovel.chapters.find((chapter) => chapter.id === initialChapterId) ?? firstNovel.chapters[0];

  const [novelId, setNovelId] = useState(firstNovel.id);
  const [chapterId, setChapterId] = useState(firstChapter.id);
  const [liveStats, setLiveStats] = useState<TypingStats>(calculateTypingStats(1, 0, 0));

  const novel = useMemo(() => novels.find((item) => item.id === novelId) ?? novels[0], [novelId]);
  const chapter = useMemo(() => novel.chapters.find((item) => item.id === chapterId) ?? novel.chapters[0], [novel, chapterId]);

  const onSelectNovel = (nextNovelId: string) => {
    const nextNovel = novels.find((item) => item.id === nextNovelId) ?? novels[0];
    setNovelId(nextNovel.id);
    setChapterId(nextNovel.chapters[0].id);
    setLiveStats(calculateTypingStats(1, 0, 0));
  };

  const onSessionComplete = async (stats: TypingStats) => {
    setLiveStats(stats);

    const response = await fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        novelId,
        chapterId,
        stats,
        completed: true
      })
    });

    if (!response.ok) {
      toast.error("Progress failed to save.");
      return;
    }

    toast.success(`Saved ${stats.netWpm} WPM at ${stats.accuracy}% accuracy.`);

    const chapterIndex = novel.chapters.findIndex((item) => item.id === chapterId);
    if (chapterIndex < novel.chapters.length - 1) {
      setChapterId(novel.chapters[chapterIndex + 1].id);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Practice Studio</h1>
          <p className="text-sm text-[var(--muted)]">Retype public-domain classics and build reliable speed under real constraints.</p>
        </div>
        <Button onClick={() => router.push("/dashboard")} size="sm" variant="ghost">
          View dashboard
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <NovelSelector
            novels={novels}
            onSelectChapter={setChapterId}
            onSelectNovel={onSelectNovel}
            selectedChapterId={chapterId}
            selectedNovelId={novelId}
          />
          <StatsDisplay stats={liveStats} />
        </div>

        <TypingInterface
          chapterId={chapterId}
          novelId={novelId}
          onSessionComplete={onSessionComplete}
          passage={chapter.passage}
        />
      </div>
    </main>
  );
}
