import { describe, expect, it, vi } from "vitest";

import { assertOfferOpen } from "@/lib/flow";

vi.mock("@/lib/deadline", () => ({
  isOfferExpired: vi.fn(),
}));

import { isOfferExpired } from "@/lib/deadline";

describe("flow", () => {
  describe("assertOfferOpen", () => {
    it("does not throw when offer is open", () => {
      vi.mocked(isOfferExpired).mockReturnValue(false);
      expect(() => assertOfferOpen()).not.toThrow();
    });

    it("throws REGISTRATION_CLOSED when offer is expired", () => {
      vi.mocked(isOfferExpired).mockReturnValue(true);
      expect(() => assertOfferOpen()).toThrow("REGISTRATION_CLOSED");
    });
  });
});
