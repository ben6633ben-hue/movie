import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limit: in-memory per edge instance. For global limits across instances, use Upstash Redis or similar.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 80; // per IP per minute for data routes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isDataRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/movie/") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/genre") ||
    pathname.startsWith("/country/") ||
    pathname.startsWith("/year/") ||
    pathname === "/movies" ||
    pathname.startsWith("/series") ||
    pathname.startsWith("/popular") ||
    pathname === "/negara" ||
    pathname === "/rekomendasi" ||
    pathname === "/"
  );
}

// User-Agents that look like scripts/scrapers (block)
const BLOCKED_UA_PATTERNS = [
  /^$/i,
  /^curl\//i,
  /^python-requests/i,
  /^python-urllib/i,
  /^go-http-client/i,
  /^wget\//i,
  /^scrapy/i,
  /^postman/i,
  /^insomnia\//i,
];

function isLikelyBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim() === "") return true;
  return BLOCKED_UA_PATTERNS.some((p) => p.test(userAgent.trim()));
}

function rateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, entry);
    return { allowed: true };
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true };
}

// Periodic cleanup of old entries (simple; runs on every request)
function cleanupRateLimitMap(): void {
  const now = Date.now();
  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now >= val.resetAt) rateLimitMap.delete(key);
    }
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent");

  // Block requests with no or script-like User-Agent
  if (isLikelyBot(userAgent)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rate limit data-heavy routes
  if (isDataRoute(pathname)) {
    cleanupRateLimitMap();
    const ip = getClientIp(request);
    const { allowed, retryAfter } = rateLimit(ip);
    if (!allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: retryAfter
          ? { "Retry-After": String(retryAfter) }
          : undefined,
      });
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
