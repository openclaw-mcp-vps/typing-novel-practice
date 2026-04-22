import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  ACCESS_COOKIE_NAME,
  ACCESS_COOKIE_VALUE,
  COOKIE_MAX_AGE_SECONDS,
  USER_COOKIE_NAME,
  hasAccessCookie,
} from "@/lib/auth";
import { getChapter, getNovelById } from "@/lib/novels";
import { getProgressSummary, recordPracticeAttempt } from "@/lib/progress-store";

export const runtime = "nodejs";

interface ProgressPostBody {
  novelId: string;
  chapterNumber: number;
  passageId: string;
  wpm: number;
  accuracy: number;
  elapsedMs: number;
  charactersTyped: number;
  completed: boolean;
}

async function getSessionContext() {
  const cookieStore = await cookies();

  let userId = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (!userId) {
    userId = randomUUID();
    cookieStore.set(USER_COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });
  }

  const hasAccess = hasAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  return {
    userId,
    hasAccess,
  };
}

export async function GET() {
  const { userId, hasAccess } = await getSessionContext();

  if (!hasAccess) {
    return NextResponse.json(
      { message: "An active subscription cookie is required to read progress." },
      { status: 403 },
    );
  }

  const progress = await getProgressSummary(userId);
  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  const { userId, hasAccess } = await getSessionContext();

  if (!hasAccess) {
    return NextResponse.json(
      { message: "An active subscription cookie is required to save progress." },
      { status: 403 },
    );
  }

  let body: ProgressPostBody;

  try {
    body = (await request.json()) as ProgressPostBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (
    typeof body.novelId !== "string" ||
    typeof body.passageId !== "string" ||
    typeof body.chapterNumber !== "number" ||
    typeof body.wpm !== "number" ||
    typeof body.accuracy !== "number" ||
    typeof body.elapsedMs !== "number" ||
    typeof body.charactersTyped !== "number" ||
    typeof body.completed !== "boolean"
  ) {
    return NextResponse.json(
      { message: "Request body fields are invalid or incomplete." },
      { status: 400 },
    );
  }

  const novel = getNovelById(body.novelId);
  if (!novel) {
    return NextResponse.json({ message: "Unknown novel." }, { status: 400 });
  }

  const chapter = getChapter(body.novelId, body.chapterNumber);
  if (!chapter) {
    return NextResponse.json({ message: "Unknown chapter." }, { status: 400 });
  }

  const passage = chapter.passages.find((item) => item.id === body.passageId);
  if (!passage) {
    return NextResponse.json({ message: "Unknown passage." }, { status: 400 });
  }

  const progress = await recordPracticeAttempt({
    userId,
    novelId: novel.id,
    novelTitle: novel.title,
    chapterNumber: chapter.number,
    chapterTitle: chapter.title,
    passageId: passage.id,
    passageTitle: passage.title,
    wpm: Number.isFinite(body.wpm) ? body.wpm : 0,
    accuracy: Number.isFinite(body.accuracy) ? body.accuracy : 0,
    elapsedMs: Math.max(0, body.elapsedMs),
    charactersTyped: Math.max(0, body.charactersTyped),
    completed: body.completed,
  });

  return NextResponse.json({ progress, access: ACCESS_COOKIE_VALUE });
}
