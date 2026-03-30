import { describe, expect, it } from "vitest";

import { isSlipBlobPath } from "@/lib/storage";

describe("storage", () => {
  describe("isSlipBlobPath", () => {
    it("returns true for paths under the slip prefix", () => {
      expect(isSlipBlobPath("payment-slips/abc/slip.pdf")).toBe(true);
    });

    it("returns false for unrelated paths", () => {
      expect(isSlipBlobPath("other-folder/file.pdf")).toBe(false);
    });

    it("returns false for exact prefix without trailing slash", () => {
      expect(isSlipBlobPath("payment-slips")).toBe(false);
    });
  });
});
