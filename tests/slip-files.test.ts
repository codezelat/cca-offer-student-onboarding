import { describe, expect, it } from "vitest";

import {
  MAX_SLIP_FILE_SIZE,
  buildSlipBlobPath,
  getSlipFileExtension,
  isAllowedSlipFile,
} from "@/lib/slip-files";

describe("slip file helpers", () => {
  it("extracts lowercase extensions", () => {
    expect(getSlipFileExtension("My Slip.PDF")).toBe("pdf");
  });

  it("accepts supported payment slip uploads", () => {
    expect(
      isAllowedSlipFile({
        filename: "payment-slip.pdf",
        size: MAX_SLIP_FILE_SIZE,
        contentType: "application/pdf",
      }),
    ).toBe(true);
  });

  it("rejects unsupported extensions and oversize uploads", () => {
    expect(
      isAllowedSlipFile({
        filename: "payment-slip.exe",
        size: 1024,
        contentType: "application/octet-stream",
      }),
    ).toBe(false);

    expect(
      isAllowedSlipFile({
        filename: "payment-slip.pdf",
        size: MAX_SLIP_FILE_SIZE + 1,
        contentType: "application/pdf",
      }),
    ).toBe(false);
  });

  it("builds a namespaced blob path for each registration", () => {
    const pathname = buildSlipBlobPath("CCA/BC/2026/03/12345678", "My Slip.pdf");

    expect(pathname).toMatch(
      /^payment-slips\/cca-bc-2026-03-12345678\/my-slip-[a-z0-9-]+\.pdf$/,
    );
  });
});
