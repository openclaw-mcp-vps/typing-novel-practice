import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { recordStripePurchase } from "@/lib/purchase-store";

export const runtime = "nodejs";

function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
): boolean {
  const pieces = signatureHeader.split(",").map((piece) => piece.trim());
  const timestamp = pieces.find((piece) => piece.startsWith("t="))?.slice(2);
  const signatures = pieces
    .filter((piece) => piece.startsWith("v1="))
    .map((piece) => piece.slice(3));

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);

  return signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  });
}

interface StripeCheckoutSession {
  id?: string;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  };
}

interface StripeEvent {
  type: string;
  data?: {
    object?: StripeCheckoutSession;
  };
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { message: "Webhook secret is not configured." },
      { status: 500 },
    );
  }

  const signatureHeader = request.headers.get("stripe-signature");
  if (!signatureHeader) {
    return NextResponse.json(
      { message: "Missing Stripe signature header." },
      { status: 400 },
    );
  }

  const payload = await request.text();

  const isValid = verifyStripeSignature(payload, signatureHeader, webhookSecret);
  if (!isValid) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(payload) as StripeEvent;

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    const email = session?.customer_details?.email ?? session?.customer_email ?? null;

    if (email) {
      await recordStripePurchase(email, session?.id ?? null);
    }
  }

  return NextResponse.json({ received: true });
}
