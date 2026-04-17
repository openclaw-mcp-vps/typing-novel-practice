"use client";

import { BookOpen } from "lucide-react";

import type { Novel } from "@/lib/novels";
import { cn } from "@/lib/utils";

interface NovelSelectorProps {
  novels: Novel[];
  selectedNovelId: string;
  selectedChapterId: string;
  onSelectNovel: (novelId: string) => void;
  onSelectChapter: (chapterId: string) => void;
}

export function NovelSelector({ novels, selectedNovelId, selectedChapterId, onSelectNovel, onSelectChapter }: NovelSelectorProps) {
  const selectedNovel = novels.find((novel) => novel.id === selectedNovelId) ?? novels[0];

  return (
    <div className="rounded-xl border bg-[var(--surface)] p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
        <BookOpen className="h-4 w-4" />
        Choose your text
      </div>

      <div className="grid gap-2">
        {novels.map((novel) => (
          <button
            key={novel.id}
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-left transition-colors",
              novel.id === selectedNovelId ? "border-[var(--accent)] bg-[#172132]" : "border-[var(--border)] hover:bg-[var(--surface-muted)]"
            )}
            onClick={() => onSelectNovel(novel.id)}
            type="button"
          >
            <div className="text-sm font-semibold">{novel.title}</div>
            <div className="text-xs text-[var(--muted)]">{novel.author}</div>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs text-[var(--muted)]" htmlFor="chapter-select">
          Chapter
        </label>
        <select
          className="w-full rounded-md border bg-[#0f141c] px-3 py-2 text-sm"
          id="chapter-select"
          onChange={(event) => onSelectChapter(event.target.value)}
          value={selectedChapterId}
        >
          {selectedNovel.chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
