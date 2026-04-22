"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RefreshCcw } from "lucide-react";

import { BookSelector } from "@/components/BookSelector";
import { ProgressStats } from "@/components/ProgressStats";
import { Button } from "@/components/ui/button";
import type { Novel } from "@/lib/novels";
import { buildTypingSnapshot } from "@/lib/typing-stats";

interface ChapterProgress {
  chapterNumber: number;
  novelId: string;
  completedAt: string | null;
  bestWpm: number;
  bestAccuracy: number;
}

interface ProgressPayload {
  chapterProgress: ChapterProgress[];
  recentAttempts: Array<{ createdAt: string; wpm: number; accuracy: number }>;
}

interface TypingInterfaceProps {
  novels: Novel[];
}

export function TypingInterface({ novels }: TypingInterfaceProps) {
  const [selectedNovelId, setSelectedNovelId] = useState(novels[0]?.id ?? "");
  const [selectedChapterNumber, setSelectedChapterNumber] = useState(1);
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);

  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const selectedNovel = useMemo(
    () => novels.find((novel) => novel.id === selectedNovelId) ?? novels[0],
    [novels, selectedNovelId],
  );

  const selectedChapter = useMemo(
    () =>
      selectedNovel.chapters.find(
        (chapter) => chapter.number === selectedChapterNumber,
      ) ?? selectedNovel.chapters[0],
    [selectedNovel, selectedChapterNumber],
  );

  const selectedPassage =
    selectedChapter.passages[selectedPassageIndex] ?? selectedChapter.passages[0];

  const completedChapterKeys = useMemo(() => {
    const keys = new Set<string>();

    for (const chapter of progress?.chapterProgress ?? []) {
      if (chapter.completedAt) {
        keys.add(`${chapter.novelId}:${chapter.chapterNumber}`);
      }
    }

    return keys;
  }, [progress]);

  const chapterPerformance = useMemo(() => {
    const current = progress?.chapterProgress.find(
      (chapter) =>
        chapter.novelId === selectedNovel.id &&
        chapter.chapterNumber === selectedChapter.number,
    );

    return {
      bestWpm: current?.bestWpm ?? 0,
      bestAccuracy: current?.bestAccuracy ?? 0,
    };
  }, [progress, selectedChapter.number, selectedNovel.id]);

  const elapsedMs = useMemo(() => {
    if (!startedAt) {
      return 0;
    }

    const end = completedAt ?? Date.now();
    return Math.max(0, end - startedAt);
  }, [completedAt, startedAt, tick]);

  const snapshot = useMemo(
    () => buildTypingSnapshot(selectedPassage.text, typed, elapsedMs),
    [elapsedMs, selectedPassage.text, typed],
  );

  const isComplete =
    typed.length === selectedPassage.text.length && typed.length > 0 && startedAt !== null;

  const loadProgress = async () => {
    try {
      const response = await fetch("/api/progress", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { progress: ProgressPayload };
      setProgress(payload.progress);
    } catch {
      return;
    }
  };

  useEffect(() => {
    void loadProgress();
  }, []);

  useEffect(() => {
    if (!startedAt || completedAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [completedAt, startedAt]);

  useEffect(() => {
    if (!isComplete || completedAt !== null || startedAt === null) {
      return;
    }

    const now = Date.now();
    setCompletedAt(now);

    const saveAttempt = async () => {
      setSaveState("saving");
      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            novelId: selectedNovel.id,
            novelTitle: selectedNovel.title,
            chapterNumber: selectedChapter.number,
            chapterTitle: selectedChapter.title,
            passageId: selectedPassage.id,
            passageTitle: selectedPassage.title,
            wpm: snapshot.wpm,
            accuracy: snapshot.accuracy,
            elapsedMs: now - startedAt,
            charactersTyped: typed.length,
            completed: true,
          }),
        });

        if (!response.ok) {
          setSaveState("error");
          return;
        }

        const payload = (await response.json()) as { progress: ProgressPayload };
        setProgress(payload.progress);
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    };

    void saveAttempt();
  }, [
    completedAt,
    isComplete,
    selectedChapter.number,
    selectedChapter.title,
    selectedNovel.id,
    selectedNovel.title,
    selectedPassage.id,
    selectedPassage.title,
    snapshot.accuracy,
    snapshot.wpm,
    startedAt,
    typed.length,
  ]);

  const resetAttempt = () => {
    setTyped("");
    setStartedAt(null);
    setCompletedAt(null);
    setSaveState("idle");
  };

  const moveToNextPassage = () => {
    if (selectedPassageIndex < selectedChapter.passages.length - 1) {
      setSelectedPassageIndex((index) => index + 1);
      resetAttempt();
      return;
    }

    const nextChapter = selectedNovel.chapters.find(
      (chapter) => chapter.number === selectedChapter.number + 1,
    );

    if (nextChapter) {
      setSelectedChapterNumber(nextChapter.number);
      setSelectedPassageIndex(0);
      resetAttempt();
    }
  };

  const onInputChange = (value: string) => {
    const boundedValue = value.slice(0, selectedPassage.text.length);

    if (!startedAt && boundedValue.length > 0) {
      setStartedAt(Date.now());
    }

    if (completedAt && boundedValue.length < selectedPassage.text.length) {
      setCompletedAt(null);
      setSaveState("idle");
    }

    setTyped(boundedValue);
  };

  return (
    <div className="space-y-6">
      <BookSelector
        novels={novels}
        selectedNovelId={selectedNovel.id}
        selectedChapterNumber={selectedChapter.number}
        completedChapterKeys={completedChapterKeys}
        onSelectNovel={(novelId) => {
          const novel = novels.find((item) => item.id === novelId);
          if (!novel) {
            return;
          }

          setSelectedNovelId(novelId);
          setSelectedChapterNumber(1);
          setSelectedPassageIndex(0);
          resetAttempt();
        }}
        onSelectChapter={(chapterNumber) => {
          setSelectedChapterNumber(chapterNumber);
          setSelectedPassageIndex(0);
          resetAttempt();
        }}
      />

      <ProgressStats
        wpm={snapshot.wpm}
        accuracy={snapshot.accuracy}
        mistakes={snapshot.mistakes}
        elapsedMs={elapsedMs}
        bestWpm={chapterPerformance.bestWpm}
        bestAccuracy={chapterPerformance.bestAccuracy}
      />

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-emerald-300">
              {selectedNovel.title} - Chapter {selectedChapter.number}
            </p>
            <h3 className="text-xl font-semibold text-slate-100">
              {selectedPassage.title}
            </h3>
          </div>
          <p className="text-sm text-slate-400">{selectedChapter.title}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 leading-8 tracking-wide sm:p-6">
          {selectedPassage.text.split("").map((character, index) => {
            const typedCharacter = typed[index];
            const isCurrent = index === typed.length;
            const hasTyped = typedCharacter !== undefined;
            const isCorrect = hasTyped && typedCharacter === character;
            const isWrong = hasTyped && typedCharacter !== character;

            return (
              <span
                key={`${character}-${index}`}
                className={`rounded px-0.5 ${
                  isCorrect
                    ? "bg-emerald-500/20 text-emerald-100"
                    : isWrong
                      ? "bg-rose-500/25 text-rose-200"
                      : isCurrent
                        ? "bg-slate-700 text-slate-100"
                        : "text-slate-400"
                }`}
              >
                {character}
              </span>
            );
          })}
        </div>

        <label htmlFor="typing-input" className="mt-5 block text-sm text-slate-300">
          Type the passage exactly as written
        </label>
        <textarea
          id="typing-input"
          value={typed}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Start typing here to begin tracking WPM and accuracy."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="mt-2 min-h-36 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-base text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={resetAttempt}>
            <RefreshCcw className="mr-2 h-4 w-4" aria-hidden />
            Restart Passage
          </Button>
          <Button type="button" onClick={moveToNextPassage}>
            Next Passage
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Button>
          {isComplete ? (
            <span className="inline-flex items-center rounded-lg border border-emerald-500/50 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100">
              <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden />
              Chapter attempt complete
            </span>
          ) : null}
          {saveState === "saved" ? (
            <span className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
              Progress saved to your dashboard
            </span>
          ) : null}
          {saveState === "error" ? (
            <span className="inline-flex items-center rounded-lg border border-rose-600/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              Could not save this attempt. Try another run.
            </span>
          ) : null}
        </div>
      </section>
    </div>
  );
}
