import type { Metadata } from "next";
import Link from "next/link";

import { UnlockForm } from "@/components/UnlockForm";

export const metadata: Metadata = {
  title: "Unlock Access",
  description:
    "Unlock your Typing Novel Practice subscription after completing Stripe checkout.",
};

export default function UnlockPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-10">
        <p className="text-sm uppercase tracking-wider text-emerald-300">Unlock Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100">
          Activate your typing workspace
        </h1>
        <p className="mt-3 text-slate-300">
          After checkout, enter the same email you used on Stripe. Once verified, we set a secure cookie and unlock Practice + Dashboard.
        </p>

        <div className="mt-6">
          <UnlockForm />
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <a
            href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-emerald-200 transition hover:bg-emerald-500/20"
          >
            Open Stripe Checkout
          </a>
          <Link
            href="/"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200 transition hover:border-slate-500"
          >
            Back to Landing Page
          </Link>
        </div>
      </div>
    </main>
  );
}
