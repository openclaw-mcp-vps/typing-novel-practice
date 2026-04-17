import { cookies } from "next/headers";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserProgress } from "@/lib/db";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("tnp_access")?.value === "1";
  const userId = cookieStore.get("tnp_user")?.value;

  if (!hasAccess) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard locked</CardTitle>
            <CardDescription>Purchase a plan to view your performance analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/practice">
              <Button>Unlock access</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const progress = userId ? await getUserProgress(userId) : null;
  const sessions = progress?.sessions ?? [];
  const avgNetWpm = sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.netWpm, 0) / sessions.length : 0;
  const avgAccuracy = sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Typing Dashboard</h1>
          <p className="text-sm text-[var(--muted)]">Performance trends from your completed chapter sessions.</p>
        </div>
        <Link href="/practice">
          <Button variant="outline">Back to practice</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Completed sessions</CardDescription>
            <CardTitle>{sessions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg net WPM</CardDescription>
            <CardTitle>{avgNetWpm.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg accuracy</CardDescription>
            <CardTitle>{avgAccuracy.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Chapters mastered</CardDescription>
            <CardTitle>{progress?.completedChapters.length ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Most recent practice completions, newest first.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No sessions yet. Complete your first chapter in practice mode.</p>
          ) : (
            <div className="space-y-2">
              {[...sessions].reverse().slice(0, 10).map((session) => (
                <div className="grid grid-cols-2 gap-2 rounded-md border bg-[var(--surface-muted)] p-3 text-sm sm:grid-cols-5" key={session.timestamp}>
                  <span>{session.novelId}</span>
                  <span>{session.chapterId}</span>
                  <span>{session.netWpm} WPM</span>
                  <span>{session.accuracy}%</span>
                  <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
