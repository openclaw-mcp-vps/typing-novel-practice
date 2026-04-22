import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE_NAME,
  ACCESS_COOKIE_VALUE,
  COOKIE_MAX_AGE_SECONDS,
  USER_COOKIE_NAME,
  normalizeEmail,
} from "@/lib/auth";
import { hasPurchased } from "@/lib/purchase-store";

export const runtime = "nodejs";

interface AccessClaimBody {
  email: string;
}

export async function POST(request: Request) {
  let body: AccessClaimBody;

  try {
    body = (await request.json()) as AccessClaimBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { message: "Please enter a valid purchase email." },
      { status: 400 },
    );
  }

  const purchased = await hasPurchased(email);
  if (!purchased) {
    return NextResponse.json(
      {
        message:
          "No completed purchase found for that email yet. If you just paid, wait a minute and try again.",
      },
      { status: 404 },
    );
  }

  const response = NextResponse.json({
    message: "Purchase verified. Your practice workspace is now unlocked.",
  });

  response.cookies.set(ACCESS_COOKIE_NAME, ACCESS_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  response.cookies.set(USER_COOKIE_NAME, randomUUID(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  return response;
}
