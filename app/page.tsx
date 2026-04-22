import { cookies } from "next/headers";

import { LandingPage } from "@/components/LandingPage";
import { ACCESS_COOKIE_NAME, hasAccessCookie } from "@/lib/auth";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasAccess = hasAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  return <LandingPage hasAccess={hasAccess} />;
}
