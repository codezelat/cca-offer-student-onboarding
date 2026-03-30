import { describe, expect, it } from "vitest";

import { validateAdminCredentials } from "@/lib/admin-login-security";

describe("admin-login-security", () => {
  describe("validateAdminCredentials", () => {
    it("accepts correct credentials", () => {
      expect(
        validateAdminCredentials("test-admin@cca.local", "test-admin-password"),
      ).toBe(true);
    });

    it("rejects wrong password", () => {
      expect(
        validateAdminCredentials("test-admin@cca.local", "wrong-password"),
      ).toBe(false);
    });

    it("rejects wrong email", () => {
      expect(
        validateAdminCredentials("wrong@cca.local", "test-admin-password"),
      ).toBe(false);
    });

    it("is case-insensitive for email", () => {
      expect(
        validateAdminCredentials("TEST-ADMIN@CCA.LOCAL", "test-admin-password"),
      ).toBe(true);
    });

    it("rejects both wrong", () => {
      expect(
        validateAdminCredentials("wrong@cca.local", "wrong-password"),
      ).toBe(false);
    });
  });
});
