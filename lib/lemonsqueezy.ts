import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export function configureLemonSqueezyForFutureUse(): string {
  lemonSqueezySetup({
    apiKey: "",
    onError: () => {
      return;
    },
  });

  return "Lemon Squeezy helpers are available, but Stripe Payment Links are active for checkout.";
}
