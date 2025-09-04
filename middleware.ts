// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const USER = process.env.BASIC_AUTH_USER || "";
const PASS = process.env.BASIC_AUTH_PASS || "";

export function middleware(req: NextRequest) {
  // Skip auth for Next internals & public assets
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml")
  ) {
    return NextResponse.next();
  }

  // Read Authorization header
  const auth = req.headers.get("authorization") || "";

  // Not provided → challenge
  if (!auth.startsWith("Basic ")) {
    return new Response("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Protected Area"' },
    });
  }

  // Validate credentials
  try {
    const [, base64] = auth.split(" ");
    const [user, pass] = atob(base64).split(":");

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  } catch {
    // fall through to challenge
  }

  // Wrong creds → challenge again
  return new Response("Invalid credentials.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected Area", charset="UTF-8"' },
  });
}

// Apply to everything except the exclusions above
export const config = {
  matcher: ["/((?!_next/|favicon.ico|robots.txt|sitemap.xml).*)"],
};
