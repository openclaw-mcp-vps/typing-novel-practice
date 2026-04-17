import { NextResponse } from "next/server";

import { registerPaidCheckout } from "@/lib/db";
import { verifyLemonSqueezySignature } from "@/lib/lemonsqueezy";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  if (!verifyLemonSqueezySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    meta?: { event_name?: string };
    data?: { id?: string };
  };

  if (payload.meta?.event_name?.includes("order") && payload.data?.id) {
    await registerPaidCheckout(payload.data.id);
  }

  return NextResponse.json({ received: true });
}
