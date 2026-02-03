import { headers } from "next/headers";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 80;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
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
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { allowed: true };
}

function cleanupRateLimitMap(): void {
  const now = Date.now();
  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now >= val.resetAt) rateLimitMap.delete(key);
    }
  }
}

/** Bot check + rate limit for data routes. Call from server components. Returns 403/429 response or null. */
export async function guardDataRoute(
  pathname: string
): Promise<Response | null> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");

  if (isLikelyBot(userAgent)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isDataRoute(pathname)) {
    cleanupRateLimitMap();
    const ip = getClientIp(headersList);
    const { allowed, retryAfter } = rateLimit(ip);
    if (!allowed) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: retryAfter
          ? { "Retry-After": String(retryAfter) }
          : undefined,
      });
    }
  }

  return null;
}
