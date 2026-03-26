import { describe, expect, it, vi } from "vitest";

import { generateRegistrationId, generateStudentId } from "@/lib/ids";

describe("ID generators", () => {
  it("generates a registration ID with the configured prefix", async () => {
    const fakePrisma = {
      student: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as never;

    const id = await generateRegistrationId(
      fakePrisma,
      "Diploma in Business Management",
    );

    expect(id).toMatch(/^SITC\/SC\/2025\/26B\/BM\/\d{8}$/);
  });

  it("generates the first student ID from 2101", async () => {
    const fakePrisma = {
      student: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as never;

    const id = await generateStudentId(fakePrisma, new Date("2026-01-01T00:00:00Z"));
    expect(id).toBe("2026-std-2101");
  });

  it("increments the highest student ID", async () => {
    const fakePrisma = {
      student: {
        findFirst: vi.fn().mockResolvedValue({ student_id: "2026-std-2114" }),
      },
    } as never;

    const id = await generateStudentId(fakePrisma, new Date("2026-01-01T00:00:00Z"));
    expect(id).toBe("2026-std-2115");
  });
});
