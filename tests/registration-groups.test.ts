import { describe, expect, it } from "vitest";

import { getRegistrationGroupBaseId, getRegistrationGroupWhere } from "@/lib/registration-groups";

describe("registration-groups", () => {
  describe("getRegistrationGroupBaseId", () => {
    it("returns the ID unchanged when no suffix", () => {
      expect(getRegistrationGroupBaseId("CCA/BC/2026/03/12345678")).toBe(
        "CCA/BC/2026/03/12345678",
      );
    });

    it("strips the numeric suffix", () => {
      expect(getRegistrationGroupBaseId("CCA/BC/2026/03/12345678-1")).toBe(
        "CCA/BC/2026/03/12345678",
      );
    });

    it("strips multi-digit suffix", () => {
      expect(getRegistrationGroupBaseId("CCA/BC/2026/03/12345678-12")).toBe(
        "CCA/BC/2026/03/12345678",
      );
    });
  });

  describe("getRegistrationGroupWhere", () => {
    it("builds a where clause that matches the base ID and suffixed IDs", () => {
      const where = getRegistrationGroupWhere("CCA/BC/2026/03/12345678-1");
      expect(where).toEqual({
        OR: [
          { registration_id: "CCA/BC/2026/03/12345678" },
          { registration_id: { startsWith: "CCA/BC/2026/03/12345678-" } },
        ],
      });
    });
  });
});
