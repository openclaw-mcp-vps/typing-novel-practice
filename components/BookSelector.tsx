"use client";

import { CheckCircle2, Lock, NotebookPen } from "lucide-react";

import type { Novel } from "@/lib/novels";

interface BookSelectorProps {
  novels: Novel[];
  selectedNovelId: string;
  selectedChapterNumber: number;
  completedChapterKeys: Set<string>;
  onSelectNovel: (novelId: string) => void;
  onSelectChapter: (chapterNumber: number) => void;
}

function isChapterUnlocked(
  novelId: string,
  chapterNumber: number,
  completedChapterKeys: Set<string>,
): boolean {
  if (chapterNumber === 1) {
    return true;
  }

  return completedChapterKeys.has(`${novelId}:${chapterNumber - 1}`);
}

export function BookSelector({
  novels,
  selectedNovelId,
  selectedChapterNumber,
  completedChapterKeys,
  onSelectNovel,
  onSelectChapter,
}: BookSelectorProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Choose Your Novel</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {novels.map((novel) => {
          const isActiveNovel = novel.id === selectedNovelId;
          const completedInNovel = novel.chapters.filter((chapter) =>
            completedChapterKeys.has(`${novel.id}:${chapter.number}`),
          ).length;

          return (
            <button
              key={novel.id}
              type="button"
              onClick={() => onSelectNovel(novel.id)}
              className={`rounded-xl border p-4 text-left transition ${
                isActiveNovel
                  ? "border-emerald-400/60 bg-emerald-400/10"
                  : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-base font-semibold text-slate-100">{novel.title}</p>
                <NotebookPen className="h-4 w-4 text-emerald-300" aria-hidden />
              </div>
              <p className="text-sm text-slate-400">{novel.author}</p>
              <p className="mt-2 text-sm text-slate-300">{novel.hook}</p>
              <p className="mt-3 text-xs text-slate-400">
                {completedInNovel}/{novel.chapters.length} chapters completed
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Chapter Ladder
        </h3>
        <div className="flex flex-wrap gap-2">
          {novels
            .find((novel) => novel.id === selectedNovelId)
            ?.chapters.map((chapter) => {
              const chapterKey = `${selectedNovelId}:${chapter.number}`;
              const unlocked = isChapterUnlocked(
                selectedNovelId,
                chapter.number,
                completedChapterKeys,
              );
              const completed = completedChapterKeys.has(chapterKey);
              const selected = chapter.number === selectedChapterNumber;

              return (
                <button
                  key={chapter.number}
                  type="button"
                  onClick={() => {
                    if (unlocked) {
                      onSelectChapter(chapter.number);
                    }
                  }}
                  disabled={!unlocked}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    selected
                      ? "border-emerald-300 bg-emerald-400/15 text-emerald-100"
                      : unlocked
                        ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
                        : "cursor-not-allowed border-slate-800 bg-slate-900/50 text-slate-500"
                  }`}
                >
                  <span>Ch. {chapter.number}</span>
                  {completed ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  ) : unlocked ? null : (
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </section>
  );
}
