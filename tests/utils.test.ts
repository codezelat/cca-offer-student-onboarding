import { describe, expect, it } from "vitest";

import {
  cn,
  digitsOnly,
  extractFirstName,
  extractLastName,
  formatBirthDate,
  formatCurrency,
  formatSimpleDate,
} from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("joins truthy class names", () => {
      expect(cn("a", "b", false, null, undefined, "c")).toBe("a b c");
    });

    it("returns empty string for all falsy values", () => {
      expect(cn(false, null, undefined)).toBe("");
    });
  });

  describe("formatCurrency", () => {
    it("formats a number as LKR", () => {
      expect(formatCurrency(3000)).toContain("3,000");
    });

    it("formats a string number", () => {
      expect(formatCurrency("3000")).toContain("3,000");
    });
  });

  describe("formatSimpleDate", () => {
    it("returns Pending for null", () => {
      expect(formatSimpleDate(null)).toBe("Pending");
    });

    it("returns Pending for undefined", () => {
      expect(formatSimpleDate(undefined)).toBe("Pending");
    });

    it("returns Pending for invalid date string", () => {
      expect(formatSimpleDate("not-a-date")).toBe("Pending");
    });

    it("formats a valid date", () => {
      const result = formatSimpleDate("2026-03-15T10:30:00Z");
      expect(result).not.toBe("Pending");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("formatBirthDate", () => {
    it("formats as YYYY-MM-DD", () => {
      expect(formatBirthDate("2026-03-15")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("extractFirstName", () => {
    it("extracts the first word", () => {
      expect(extractFirstName("John Doe Smith")).toBe("John");
    });

    it("returns the only word", () => {
      expect(extractFirstName("John")).toBe("John");
    });

    it("trims leading whitespace", () => {
      expect(extractFirstName("  John  ")).toBe("John");
    });
  });

  describe("extractLastName", () => {
    it("returns everything after the first word", () => {
      expect(extractLastName("John Doe Smith")).toBe("Doe Smith");
    });

    it("returns the only word when single word", () => {
      expect(extractLastName("John")).toBe("John");
    });
  });

  describe("digitsOnly", () => {
    it("removes all non-digit characters", () => {
      expect(digitsOnly("+94 77 123 4567")).toBe("94771234567");
    });
  });
});
