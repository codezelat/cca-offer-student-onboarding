import { describe, expect, it } from "vitest";

import {
  createReceiptAccessToken,
  hasReceiptAccess,
} from "@/lib/receipt-access";

describe("receipt access tokens", () => {
  it("allows access for the same registration group", async () => {
    const token = await createReceiptAccessToken("CCA/BC/2026/03/12345678-1");

    await expect(
      hasReceiptAccess({
        registrationId: "CCA/BC/2026/03/12345678-2",
        token,
      }),
    ).resolves.toBe(true);
  });

  it("rejects access for a different registration group", async () => {
    const token = await createReceiptAccessToken("CCA/BC/2026/03/12345678");

    await expect(
      hasReceiptAccess({
        registrationId: "CCA/BC/2026/03/87654321",
        token,
      }),
    ).resolves.toBe(false);
  });
});
