export interface TypingSnapshot {
  accuracy: number;
  wpm: number;
  mistakes: number;
  correctCharacters: number;
}

export function countCorrectCharacters(target: string, typed: string): number {
  const length = Math.min(target.length, typed.length);
  let correct = 0;

  for (let index = 0; index < length; index += 1) {
    if (target[index] === typed[index]) {
      correct += 1;
    }
  }

  return correct;
}

export function countMistakes(target: string, typed: string): number {
  const length = Math.min(target.length, typed.length);
  let mistakes = 0;

  for (let index = 0; index < length; index += 1) {
    if (target[index] !== typed[index]) {
      mistakes += 1;
    }
  }

  if (typed.length > target.length) {
    mistakes += typed.length - target.length;
  }

  return mistakes;
}

export function calculateAccuracy(correctCharacters: number, typedLength: number): number {
  if (typedLength === 0) {
    return 100;
  }

  return Number(((correctCharacters / typedLength) * 100).toFixed(1));
}

export function calculateWpm(correctCharacters: number, elapsedMs: number): number {
  if (elapsedMs <= 0) {
    return 0;
  }

  const words = correctCharacters / 5;
  const minutes = elapsedMs / 1000 / 60;

  return Number((words / minutes).toFixed(1));
}

export function buildTypingSnapshot(
  target: string,
  typed: string,
  elapsedMs: number,
): TypingSnapshot {
  const correctCharacters = countCorrectCharacters(target, typed);
  const mistakes = countMistakes(target, typed);

  return {
    accuracy: calculateAccuracy(correctCharacters, typed.length),
    wpm: calculateWpm(correctCharacters, elapsedMs),
    mistakes,
    correctCharacters,
  };
}
