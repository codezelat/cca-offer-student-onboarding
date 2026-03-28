import { describe, expect, it, vi } from "vitest";

import { generateRegistrationId } from "@/lib/ids";

describe("ID generators", () => {
  it("generates a registration ID with the configured prefix", async () => {
    const fakePrisma = {
      student: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as never;

    const id = await generateRegistrationId(fakePrisma);

    expect(id).toMatch(/^CCA\/BC\/2026\/03\/\d{8}$/);
  });
});
