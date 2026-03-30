import { describe, expect, it } from "vitest";

import { getPayHereUrls } from "@/lib/student-service";

describe("student-service", () => {
  describe("getPayHereUrls", () => {
    it("generates the three PayHere URLs from the origin", () => {
      const urls = getPayHereUrls("https://example.com");

      expect(urls.returnUrl).toBe("https://example.com/payment/payhere-success");
      expect(urls.cancelUrl).toBe("https://example.com/payment/options");
      expect(urls.notifyUrl).toBe("https://example.com/api/payment/notify");
    });

    it("defaults to the configured app URL", () => {
      const urls = getPayHereUrls();
      expect(urls.returnUrl).toContain("/payment/payhere-success");
    });
  });
});
