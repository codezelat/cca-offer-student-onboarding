import { describe, expect, it } from "vitest";

import { publicCopy } from "@/lib/content/public";
import { adminCopy } from "@/lib/content/admin";

describe("copy parity", () => {
  it("preserves high-trust public strings", () => {
    expect(publicCopy.home.cta).toBe("Choose Your Bootcamps");
    expect(publicCopy.eligibility.title).toBe("Register Now");
    expect(publicCopy.paymentSuccess.paymentLabels.completed).toBe("COMPLETED");
    expect(publicCopy.offerEnded.title).toBe("Registration Period Has Ended");
  });

  it("preserves admin identity copy", () => {
    expect(adminCopy.login.title).toBe("CCA Registration System");
    expect(adminCopy.dashboard.title).toBe("Admin Dashboard");
  });
});
