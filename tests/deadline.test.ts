import { describe, expect, it } from "vitest";

import { getCountdownDeadlineDate, isOfferExpired } from "@/lib/deadline";

describe("deadline", () => {
  describe("getCountdownDeadlineDate", () => {
    it("parses the deadline from env", () => {
      const deadline = getCountdownDeadlineDate();
      expect(deadline).toBeInstanceOf(Date);
      expect(Number.isNaN(deadline?.getTime())).toBe(false);
    });
  });

  describe("isOfferExpired", () => {
    it("returns false when reference is before the deadline", () => {
      expect(isOfferExpired(new Date("2020-01-01"))).toBe(false);
    });

    it("returns true when reference is well after the deadline", () => {
      expect(isOfferExpired(new Date("2099-01-01"))).toBe(true);
    });
  });
});
