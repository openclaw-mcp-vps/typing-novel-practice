import { promises as fs } from "node:fs";
import path from "node:path";

export type SessionRecord = {
  novelId: string;
  chapterId: string;
  completed: boolean;
  accuracy: number;
  netWpm: number;
  grossWpm: number;
  elapsedSeconds: number;
  timestamp: string;
};

export type UserProgress = {
  currentNovelId: string;
  currentChapterId: string;
  completedChapters: string[];
  sessions: SessionRecord[];
};

type DbShape = {
  users: Record<string, UserProgress>;
  paidCheckouts: string[];
};

const DB_PATH = path.join(process.cwd(), "data", "progress.json");

const initialDb: DbShape = {
  users: {},
  paidCheckouts: []
};

async function ensureDbFile() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2), "utf-8");
  }
}

export async function readDb(): Promise<DbShape> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf-8");

  try {
    return JSON.parse(raw) as DbShape;
  } catch {
    return initialDb;
  }
}

export async function writeDb(db: DbShape) {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const db = await readDb();
  return db.users[userId] ?? null;
}

export async function upsertUserProgress(userId: string, updater: (current: UserProgress | null) => UserProgress) {
  const db = await readDb();
  const next = updater(db.users[userId] ?? null);
  db.users[userId] = next;
  await writeDb(db);
  return next;
}

export async function registerPaidCheckout(checkoutId: string) {
  const db = await readDb();
  if (!db.paidCheckouts.includes(checkoutId)) {
    db.paidCheckouts.push(checkoutId);
    await writeDb(db);
  }
}

export async function isPaidCheckout(checkoutId: string) {
  const db = await readDb();
  return db.paidCheckouts.includes(checkoutId);
}
