export type TypingStats = {
  elapsedSeconds: number;
  charsTyped: number;
  correctChars: number;
  mistakes: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
};

export function calculateTypingStats(elapsedSeconds: number, charsTyped: number, correctChars: number): TypingStats {
  const safeSeconds = Math.max(elapsedSeconds, 1);
  const wordsTyped = charsTyped / 5;
  const grossWpm = Number(((wordsTyped * 60) / safeSeconds).toFixed(1));
  const mistakes = Math.max(0, charsTyped - correctChars);
  const netWpm = Number(Math.max(0, grossWpm - mistakes / (safeSeconds / 60)).toFixed(1));
  const accuracy = Number((charsTyped === 0 ? 100 : (correctChars / charsTyped) * 100).toFixed(1));

  return {
    elapsedSeconds: safeSeconds,
    charsTyped,
    correctChars,
    mistakes,
    grossWpm,
    netWpm,
    accuracy
  };
}

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
