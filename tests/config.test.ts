import { describe, expect, it } from "vitest";

import {
  bootcamps,
  decodeBootcampQuery,
  districts,
  encodeBootcampQuery,
  getWhatsAppGroupLink,
  isValidBootcamp,
  whatsappGroups,
} from "@/lib/config";

describe("config", () => {
  describe("bootcamps", () => {
    it("has 14 bootcamp configs", () => {
      expect(bootcamps).toHaveLength(14);
    });

    it("every bootcamp has a WhatsApp group link", () => {
      for (const name of bootcamps) {
        expect(whatsappGroups[name]).toBeTruthy();
      }
    });
  });

  describe("isValidBootcamp", () => {
    it("returns true for valid bootcamp names", () => {
      expect(isValidBootcamp("Software Engineer")).toBe(true);
      expect(isValidBootcamp("Project Manager")).toBe(true);
    });

    it("returns false for invalid names", () => {
      expect(isValidBootcamp("Does Not Exist")).toBe(false);
      expect(isValidBootcamp("")).toBe(false);
    });
  });

  describe("getWhatsAppGroupLink", () => {
    it("returns the link for a known bootcamp", () => {
      const link = getWhatsAppGroupLink("Software Engineer");
      expect(link).toContain("https://chat.whatsapp.com/");
    });

    it("returns null for an unknown bootcamp", () => {
      expect(getWhatsAppGroupLink("Fake Bootcamp")).toBeNull();
    });
  });

  describe("encodeBootcampQuery / decodeBootcampQuery", () => {
    it("round-trips a single bootcamp", () => {
      const encoded = encodeBootcampQuery(["Software Engineer"]);
      const decoded = decodeBootcampQuery(encoded);
      expect(decoded).toEqual(["Software Engineer"]);
    });

    it("round-trips multiple bootcamps", () => {
      const encoded = encodeBootcampQuery(["Software Engineer", "QA Engineer"]);
      const decoded = decodeBootcampQuery(encoded);
      expect(decoded).toEqual(["Software Engineer", "QA Engineer"]);
    });

    it("returns empty array for empty input", () => {
      expect(decodeBootcampQuery(null)).toEqual([]);
      expect(decodeBootcampQuery(undefined)).toEqual([]);
      expect(decodeBootcampQuery("")).toEqual([]);
    });

    it("deduplicates bootcamps", () => {
      const encoded = encodeBootcampQuery(["Software Engineer", "Software Engineer"]);
      const decoded = decodeBootcampQuery(encoded);
      expect(decoded).toEqual(["Software Engineer"]);
    });

    it("filters out invalid bootcamp names", () => {
      const decoded = decodeBootcampQuery("software-engineer,nonexistent-program");
      expect(decoded).toEqual(["Software Engineer"]);
    });
  });

  describe("districts", () => {
    it("has 25 districts", () => {
      expect(districts).toHaveLength(25);
    });

    it("includes Colombo and Jaffna", () => {
      expect(districts).toContain("Colombo");
      expect(districts).toContain("Jaffna");
    });
  });
});
