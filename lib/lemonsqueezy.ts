import crypto from "node:crypto";

const CHECKOUT_BASE = "https://checkout.lemonsqueezy.com/buy";

export function getCheckoutUrl() {
  const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;
  if (!productId) {
    return "";
  }

  return `${CHECKOUT_BASE}/${productId}?embed=1&logo=0`;
}

export function verifyLemonSqueezySignature(rawBody: string, signature: string | null) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
