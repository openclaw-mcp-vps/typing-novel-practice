import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

interface ChapterAggregate {
  chapterNumber: number;
  chapterTitle: string;
  novelId: string;
  novelTitle: string;
  attempts: number;
  bestWpm: number;
  bestAccuracy: number;
  completedAt: string | null;
  lastAttemptAt: string;
}

export interface PracticeAttempt {
  id: string;
  novelId: string;
  novelTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  passageId: string;
  passageTitle: string;
  wpm: number;
  accuracy: number;
  elapsedMs: number;
  charactersTyped: number;
  completed: boolean;
  createdAt: string;
}

interface UserProgressRecord {
  userId: string;
  createdAt: string;
  updatedAt: string;
  attempts: PracticeAttempt[];
  chapters: Record<string, ChapterAggregate>;
}

interface ProgressDatabase {
  users: Record<string, UserProgressRecord>;
}

export interface AttemptInput {
  userId: string;
  novelId: string;
  novelTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  passageId: string;
  passageTitle: string;
  wpm: number;
  accuracy: number;
  elapsedMs: number;
  charactersTyped: number;
  completed: boolean;
}

export interface ProgressSummary {
  userId: string;
  totalAttempts: number;
  totalCompletedChapters: number;
  averageWpm: number;
  averageAccuracy: number;
  chapterProgress: ChapterAggregate[];
  recentAttempts: PracticeAttempt[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const PROGRESS_PATH = path.join(DATA_DIR, "progress.json");

const EMPTY_DATABASE: ProgressDatabase = {
  users: {},
};

function chapterKey(novelId: string, chapterNumber: number): string {
  return `${novelId}:${chapterNumber}`;
}

async function ensureDataDirectory(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readDatabase(): Promise<ProgressDatabase> {
  await ensureDataDirectory();

  try {
    const raw = await fs.readFile(PROGRESS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<ProgressDatabase>;

    return {
      users: parsed.users ?? {},
    };
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      await writeDatabase(EMPTY_DATABASE);
      return { users: {} };
    }

    throw error;
  }
}

async function writeDatabase(database: ProgressDatabase): Promise<void> {
  await ensureDataDirectory();

  const temporaryPath = `${PROGRESS_PATH}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(database, null, 2), "utf8");
  await fs.rename(temporaryPath, PROGRESS_PATH);
}

function buildSummary(record: UserProgressRecord): ProgressSummary {
  const attempts = record.attempts;
  const chapterProgress = Object.values(record.chapters).sort((a, b) => {
    if (a.novelTitle === b.novelTitle) {
      return a.chapterNumber - b.chapterNumber;
    }
    return a.novelTitle.localeCompare(b.novelTitle);
  });

  const totalWpm = attempts.reduce((sum, attempt) => sum + attempt.wpm, 0);
  const totalAccuracy = attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0);
  const completedChapters = chapterProgress.filter(
    (chapter) => chapter.completedAt !== null,
  ).length;

  return {
    userId: record.userId,
    totalAttempts: attempts.length,
    totalCompletedChapters: completedChapters,
    averageWpm:
      attempts.length > 0 ? Number((totalWpm / attempts.length).toFixed(1)) : 0,
    averageAccuracy:
      attempts.length > 0 ? Number((totalAccuracy / attempts.length).toFixed(1)) : 0,
    chapterProgress,
    recentAttempts: [...attempts]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 20),
  };
}

export async function getProgressSummary(userId: string): Promise<ProgressSummary> {
  const database = await readDatabase();
  const record = database.users[userId];

  if (!record) {
    return {
      userId,
      totalAttempts: 0,
      totalCompletedChapters: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      chapterProgress: [],
      recentAttempts: [],
    };
  }

  return buildSummary(record);
}

export async function recordPracticeAttempt(
  input: AttemptInput,
): Promise<ProgressSummary> {
  const database = await readDatabase();

  const nowIso = new Date().toISOString();
  const existingRecord = database.users[input.userId] ?? {
    userId: input.userId,
    createdAt: nowIso,
    updatedAt: nowIso,
    attempts: [],
    chapters: {},
  };

  const attempt: PracticeAttempt = {
    id: randomUUID(),
    novelId: input.novelId,
    novelTitle: input.novelTitle,
    chapterNumber: input.chapterNumber,
    chapterTitle: input.chapterTitle,
    passageId: input.passageId,
    passageTitle: input.passageTitle,
    wpm: input.wpm,
    accuracy: input.accuracy,
    elapsedMs: input.elapsedMs,
    charactersTyped: input.charactersTyped,
    completed: input.completed,
    createdAt: nowIso,
  };

  existingRecord.attempts.push(attempt);

  if (existingRecord.attempts.length > 500) {
    existingRecord.attempts = existingRecord.attempts.slice(-500);
  }

  const key = chapterKey(input.novelId, input.chapterNumber);
  const existingChapter = existingRecord.chapters[key];

  const updatedChapter: ChapterAggregate = {
    chapterNumber: input.chapterNumber,
    chapterTitle: input.chapterTitle,
    novelId: input.novelId,
    novelTitle: input.novelTitle,
    attempts: (existingChapter?.attempts ?? 0) + 1,
    bestWpm: Math.max(existingChapter?.bestWpm ?? 0, input.wpm),
    bestAccuracy: Math.max(existingChapter?.bestAccuracy ?? 0, input.accuracy),
    completedAt:
      input.completed && existingChapter?.completedAt === null
        ? nowIso
        : existingChapter?.completedAt ?? (input.completed ? nowIso : null),
    lastAttemptAt: nowIso,
  };

  existingRecord.chapters[key] = updatedChapter;
  existingRecord.updatedAt = nowIso;

  database.users[input.userId] = existingRecord;
  await writeDatabase(database);

  return buildSummary(existingRecord);
}
