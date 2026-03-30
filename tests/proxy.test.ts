import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import { proxy } from "@/proxy";

describe("deadline proxy", () => {
  it("allows admin slip file routes after deadline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));

    const response = proxy(
      new NextRequest("https://offer.codezela.com/files/slips/123"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();

    vi.useRealTimers();
  });

  it("redirects non-excluded routes after deadline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));

    const response = proxy(
      new NextRequest("https://offer.codezela.com/register"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/offer-ended");

    vi.useRealTimers();
  });

  it("does not exclude non-slip file paths", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));

    const response = proxy(
      new NextRequest("https://offer.codezela.com/files/other/123"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/offer-ended");

    vi.useRealTimers();
  });

  it("allows admin receipt routes after deadline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));

    const response = proxy(
      new NextRequest("https://offer.codezela.com/payment/receipt/123"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();

    vi.useRealTimers();
  });
});
