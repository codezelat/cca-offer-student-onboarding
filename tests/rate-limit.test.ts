import { describe, expect, it } from "vitest";

import { getRateLimitHeaders, isRateLimited } from "@/lib/rate-limit";

function makeRequest(ip: string) {
  return new Request("http://localhost/api/test", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("rate limiting", () => {
  it("allows requests within the limit", () => {
    const request = makeRequest("1.2.3.4");
    const result = isRateLimited(request);
    expect(result.limited).toBe(false);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it("blocks requests after exceeding the limit", () => {
    const request = makeRequest("5.6.7.8");
    let lastResult = isRateLimited(request);

    for (let i = 0; i < 10; i++) {
      lastResult = isRateLimited(request);
    }

    expect(lastResult.limited).toBe(true);
    expect(lastResult.remaining).toBe(0);
  });

  it("tracks different IPs independently", () => {
    const reqA = makeRequest("10.0.0.1");
    const reqB = makeRequest("10.0.0.2");

    for (let i = 0; i < 10; i++) {
      isRateLimited(reqA);
    }

    const resultB = isRateLimited(reqB);
    expect(resultB.limited).toBe(false);
  });

  describe("getRateLimitHeaders", () => {
    it("produces the three standard header keys", () => {
      const result = isRateLimited(makeRequest("9.8.7.6"));
      const headers = getRateLimitHeaders(result);

      expect(headers).toHaveProperty("X-RateLimit-Limit");
      expect(headers).toHaveProperty("X-RateLimit-Remaining");
      expect(headers).toHaveProperty("X-RateLimit-Reset");
    });
  });
});
