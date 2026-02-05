import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge middleware only (no Node APIs). Bot/rate-limit logic is in lib/requestGuard.ts (server components).
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
