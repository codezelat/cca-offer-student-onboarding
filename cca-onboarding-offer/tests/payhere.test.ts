import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  generatePayHereNotifyHash,
  generatePayHereStartHash,
} from "@/lib/payhere";

function md5(value: string) {
  return createHash("md5").update(value).digest("hex").toUpperCase();
}

describe("PayHere hashing", () => {
  it("generates the start hash using merchant secret md5", () => {
    process.env.PAYHERE_MERCHANT_SECRET = "secret";
    process.env.PAYHERE_MERCHANT_ID = "merchant";

    const hash = generatePayHereStartHash(
      "merchant",
      "ORD-123",
      "4000.00",
      "LKR",
    );

    expect(hash).toBe(
      md5(`merchantORD-1234000.00LKR${md5("secret")}`),
    );
  });

  it("generates the notify hash", () => {
    process.env.PAYHERE_MERCHANT_SECRET = "secret";

    const hash = generatePayHereNotifyHash({
      merchant_id: "merchant",
      order_id: "ORD-123",
      payhere_amount: "4000.00",
      payhere_currency: "LKR",
      status_code: "2",
    });

    expect(hash).toBe(
      md5(`merchantORD-1234000.00LKR2${md5("secret")}`),
    );
  });
});
