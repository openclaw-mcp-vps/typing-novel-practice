"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, CirclePause, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateTypingStats, type TypingStats } from "@/lib/typing-stats";

interface TypingInterfaceProps {
  passage: string;
  novelId: string;
  chapterId: string;
  onSessionComplete: (stats: TypingStats) => void;
}

export function TypingInterface({ passage, novelId, chapterId, onSessionComplete }: TypingInterfaceProps) {
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTypedText("");
    setStartedAt(null);
    setElapsedSeconds(0);
    setIsComplete(false);
    inputRef.current?.focus();
  }, [novelId, chapterId, passage]);

  useEffect(() => {
    if (!startedAt || isComplete) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((Date.now() - startedAt) / 1000);
    }, 100);

    return () => clearInterval(timer);
  }, [startedAt, isComplete]);

  const stats = useMemo(() => {
    const typedChars = typedText.length;
    const correctChars = typedText.split("").filter((char, idx) => char === passage[idx]).length;
    return calculateTypingStats(elapsedSeconds, typedChars, correctChars);
  }, [typedText, passage, elapsedSeconds]);

  const handleChange = (nextText: string) => {
    if (isComplete) {
      return;
    }

    if (!startedAt && nextText.length > 0) {
      setStartedAt(Date.now());
    }

    const limited = nextText.slice(0, passage.length);
    setTypedText(limited);

    if (limited.length === passage.length) {
      const allCorrect = limited === passage;
      setIsComplete(allCorrect);
      if (allCorrect) {
        const finalStats = calculateTypingStats(elapsedSeconds || 1, limited.length, limited.length);
        onSessionComplete(finalStats);
      }
    }
  };

  const reset = () => {
    setTypedText("");
    setStartedAt(null);
    setElapsedSeconds(0);
    setIsComplete(false);
    inputRef.current?.focus();
  };

  return (
    <div className="rounded-xl border bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-[var(--muted)]">Retype exactly as shown</div>
        {isComplete ? <Badge variant="success">Chapter complete</Badge> : <Badge>In progress</Badge>}
      </div>

      <div className="mb-4 rounded-lg border bg-[#0f141c] p-4 text-sm leading-relaxed">
        {passage.split("").map((char, index) => {
          let className = "text-[var(--text)]";
          if (index < typedText.length) {
            className = typedText[index] === char ? "text-[#8ce99a]" : "text-[#ff9b94] bg-[#f8514920]";
          } else if (index === typedText.length) {
            className = "text-[var(--text)] bg-[#1f6feb40]";
          }

          return (
            <span className={className} key={`${char}-${index}`}>
              {char}
            </span>
          );
        })}
      </div>

      <input
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="sr-only"
        onChange={(event) => handleChange(event.target.value)}
        ref={inputRef}
        spellCheck={false}
        value={typedText}
      />

      <div
        className="mb-4 rounded-md border border-dashed px-3 py-2 text-sm text-[var(--muted)]"
        onClick={() => inputRef.current?.focus()}
        onKeyDown={() => inputRef.current?.focus()}
        role="button"
        tabIndex={0}
      >
        Start typing. Keep this box focused. Characters are validated in real time.
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={reset} type="button" variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart
        </Button>

        {isComplete ? (
          <div className="flex items-center gap-1 text-sm text-[#8ce99a]">
            <CheckCircle2 className="h-4 w-4" />
            Perfect run completed
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-[var(--muted)]">
            <CirclePause className="h-4 w-4" />
            Finish with zero mistakes to complete the chapter
          </div>
        )}
      </div>

      {typedText.length === passage.length && !isComplete ? (
        <div className="mt-3 rounded-md border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[#ff9b94]">
          You reached the end with mistakes. Press restart and try a clean pass.
        </div>
      ) : null}

      <div className="mt-3 text-xs text-[var(--muted)]">Progress: {typedText.length} / {passage.length} characters</div>
    </div>
  );
}
