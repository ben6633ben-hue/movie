import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Bot check and rate limit live in lib/requestGuard.ts (called from server components).
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
