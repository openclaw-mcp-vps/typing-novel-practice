import crypto from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { findNovel } from "@/lib/novels";
import { getUserProgress, upsertUserProgress } from "@/lib/db";
import type { TypingStats } from "@/lib/typing-stats";

function getOrCreateUserId(existing: string | undefined) {
  return existing ?? crypto.randomUUID();
}

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("tnp_user")?.value;

  if (!userId) {
    return NextResponse.json({ progress: null });
  }

  const progress = await getUserProgress(userId);
  return NextResponse.json({ progress });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { novelId: string; chapterId: string; stats: TypingStats; completed: boolean };
  const cookieStore = await cookies();

  const userId = getOrCreateUserId(cookieStore.get("tnp_user")?.value);
  const novel = findNovel(body.novelId);
  const chapter = novel.chapters.find((item) => item.id === body.chapterId) ?? novel.chapters[0];

  const progress = await upsertUserProgress(userId, (current) => {
    const completedChapters = new Set(current?.completedChapters ?? []);

    if (body.completed) {
      completedChapters.add(`${novel.id}:${chapter.id}`);
    }

    return {
      currentNovelId: novel.id,
      currentChapterId: chapter.id,
      completedChapters: [...completedChapters],
      sessions: [
        ...(current?.sessions ?? []),
        {
          novelId: novel.id,
          chapterId: chapter.id,
          completed: body.completed,
          accuracy: body.stats.accuracy,
          netWpm: body.stats.netWpm,
          grossWpm: body.stats.grossWpm,
          elapsedSeconds: body.stats.elapsedSeconds,
          timestamp: new Date().toISOString()
        }
      ]
    };
  });

  const response = NextResponse.json({ progress });
  response.cookies.set("tnp_user", userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  return response;
}
