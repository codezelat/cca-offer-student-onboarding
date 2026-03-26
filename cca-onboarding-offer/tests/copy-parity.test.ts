import { describe, expect, it } from "vitest";

import { publicCopy } from "@/lib/content/public";
import { adminCopy } from "@/lib/content/admin";

describe("copy parity", () => {
  it("preserves high-trust public strings", () => {
    expect(publicCopy.home.cta).toBe("ඩිප්ලෝමාව තෝරාගන්න (Select Diploma)");
    expect(publicCopy.eligibility.title).toBe("දැන්ම ලියාපදිංචි වන්න");
    expect(publicCopy.paymentSuccess.paymentLabels.completed).toBe("COMPLETED");
    expect(publicCopy.offerEnded.title).toBe("Registration Period Has Ended");
  });

  it("preserves admin identity copy", () => {
    expect(adminCopy.login.title).toBe("Special Registration System");
    expect(adminCopy.dashboard.title).toBe("Admin Dashboard");
  });
});
