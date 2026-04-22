import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardPanel } from "@/components/DashboardPanel";
import { ACCESS_COOKIE_NAME, hasAccessCookie } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Review typing speed, accuracy, chapter completion, and trendlines over time.",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasAccess = hasAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!hasAccess) {
    redirect("/unlock");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-emerald-300">
            Typing Novel Practice
          </p>
          <h1 className="text-3xl font-semibold text-slate-100">Progress Dashboard</h1>
          <p className="mt-1 text-slate-300">
            Use trendlines and chapter bests to target your next speed milestone.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/practice"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
          >
            Continue Practice
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
          >
            Back Home
          </Link>
        </div>
      </header>

      <DashboardPanel />
    </main>
  );
}
