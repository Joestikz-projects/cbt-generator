import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const expected = process.env.APP_PASSWORD;

  // If no password is configured, the app stays open (e.g. local dev).
  if (!expected) return NextResponse.next();

  const cookie = req.cookies.get("cbt_auth")?.value;
  if (cookie === expected) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!login|api/login|_next/static|_next/image|favicon.ico).*)",
  ],
};
