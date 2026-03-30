import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    student: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/storage", () => ({
  readSlipFile: vi.fn(),
}));

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { readSlipFile } from "@/lib/storage";
import { GET } from "@/app/files/slips/[studentId]/route";

describe("slip file route access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects non-admin requests", async () => {
    vi.mocked(getSession).mockResolvedValue({});

    const response = await GET(
      new Request("https://offer.codezela.com/files/slips/1"),
      {
        params: Promise.resolve({ studentId: "1" }),
      },
    );

    expect(response.status).toBe(401);
    expect(vi.mocked(prisma.student.findUnique)).not.toHaveBeenCalled();
  });

  it("returns 404 for invalid student ids", async () => {
    vi.mocked(getSession).mockResolvedValue({ admin_logged_in: true });

    const response = await GET(
      new Request("https://offer.codezela.com/files/slips/not-a-number"),
      {
        params: Promise.resolve({ studentId: "not-a-number" }),
      },
    );

    expect(response.status).toBe(404);
    expect(vi.mocked(prisma.student.findUnique)).not.toHaveBeenCalled();
    expect(vi.mocked(readSlipFile)).not.toHaveBeenCalled();
  });
});
