import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_COOKIE_NAME,
  COOKIE_MAX_AGE_SECONDS,
  USER_COOKIE_NAME,
  hasAccessCookie,
} from "@/lib/auth";

function withUserCookie(request: NextRequest, response: NextResponse): NextResponse {
  if (!request.cookies.get(USER_COOKIE_NAME)?.value) {
    response.cookies.set(USER_COOKIE_NAME, crypto.randomUUID(), {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });
  }

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccess = hasAccessCookie(request.cookies.get(ACCESS_COOKIE_NAME)?.value);

  if (pathname.startsWith("/api/progress") && !hasAccess) {
    return withUserCookie(
      request,
      NextResponse.json(
        { message: "Subscription access cookie required for progress APIs." },
        { status: 403 },
      ),
    );
  }

  if ((pathname.startsWith("/practice") || pathname.startsWith("/dashboard")) && !hasAccess) {
    const redirectUrl = new URL("/unlock", request.url);
    redirectUrl.searchParams.set("reason", "subscription_required");

    return withUserCookie(request, NextResponse.redirect(redirectUrl));
  }

  return withUserCookie(request, NextResponse.next());
}

export const config = {
  matcher: ["/practice/:path*", "/dashboard/:path*", "/api/progress"],
};
