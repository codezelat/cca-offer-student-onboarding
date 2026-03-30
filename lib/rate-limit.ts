// In-memory rate limiting for public API endpoints
// Resets on deploy - suitable for simple protection without DB writes

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per window

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Periodic cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

export function isRateLimited(request: Request): {
  limited: boolean;
  remaining: number;
  resetTime: number;
} {
  const clientIp = getClientIp(request);
  const now = Date.now();

  let entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetTime) {
    // Create new window
    entry = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    rateLimitMap.set(clientIp, entry);
    return {
      limited: false,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return {
      limited: true,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    limited: false,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    resetTime: entry.resetTime,
  };
}

export function getRateLimitHeaders(result: {
  limited: boolean;
  remaining: number;
  resetTime: number;
}): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
  };
}
