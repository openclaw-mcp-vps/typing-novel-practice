import { cookies } from "next/headers";
import Link from "next/link";

import { CheckoutButton } from "@/components/CheckoutButton";
import { PracticeExperience } from "@/components/PracticeExperience";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCheckoutUrl } from "@/lib/lemonsqueezy";

export default async function PracticePage() {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("tnp_access")?.value === "1";

  if (!hasAccess) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Practice area is members-only</CardTitle>
            <CardDescription>Purchase unlocks full access to chapter practice, saved progress, and your performance dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <CheckoutButton checkoutUrl={getCheckoutUrl()} />
            <Link href="/">
              <Button className="w-full" variant="ghost">
                Back to landing page
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <PracticeExperience />;
}
