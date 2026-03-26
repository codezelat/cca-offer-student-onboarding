import { describe, expect, it } from "vitest";

import { validateSriLankanNic } from "@/lib/nic";

describe("validateSriLankanNic", () => {
  it("accepts a valid old-format NIC", () => {
    const result = validateSriLankanNic("951231234V");
    expect(result.valid).toBe(true);
  });

  it("accepts a valid new-format NIC", () => {
    const result = validateSriLankanNic("200012312345");
    expect(result.valid).toBe(true);
  });

  it("rejects invalid format", () => {
    const result = validateSriLankanNic("ABC");
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Invalid NIC format. Use either 9 digits + V/X or 12 digits.",
    );
  });
});
