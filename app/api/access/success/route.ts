import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const source = url.searchParams.get("source");

  if (source !== "checkout") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const response = NextResponse.redirect(new URL("/practice", req.url));
  response.cookies.set("tnp_access", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 31
  });

  return response;
}
