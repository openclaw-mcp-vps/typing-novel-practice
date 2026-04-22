import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Lemon Squeezy webhooks are disabled for this project. Use /api/webhooks/stripe.",
    },
    { status: 410 },
  );
}
