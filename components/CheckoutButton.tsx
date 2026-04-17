"use client";

import Script from "next/script";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    LemonSqueezy?: {
      Url: { Open: (url: string) => void };
    };
  }
}

interface CheckoutButtonProps {
  checkoutUrl: string;
}

export function CheckoutButton({ checkoutUrl }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const openCheckout = async () => {
    if (!checkoutUrl) {
      toast.error("Checkout is not configured yet.");
      return;
    }

    setLoading(true);
    const redirect = `${window.location.origin}/api/access/success?source=checkout`;
    const url = `${checkoutUrl}&checkout[success_url]=${encodeURIComponent(redirect)}`;

    if (window.LemonSqueezy?.Url) {
      window.LemonSqueezy.Url.Open(url);
      setLoading(false);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setLoading(false);
  };

  return (
    <>
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="afterInteractive" />
      <Button className="w-full" onClick={openCheckout} size="lg" type="button">
        {loading ? "Opening checkout..." : "Unlock full app for $5/month"}
      </Button>
    </>
  );
}
