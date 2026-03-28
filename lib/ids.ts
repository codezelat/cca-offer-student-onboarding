import type { PrismaClient } from "@/generated/postgres/client";

import { BOOTCAMP_REG_PREFIX } from "@/lib/config";

export async function generateRegistrationId(prisma: PrismaClient) {
  // We use the same prefix for all bootcamps now
  const prefix = BOOTCAMP_REG_PREFIX;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const random = `${Math.floor(Math.random() * 100000000)}`.padStart(8, "0");
    const registrationId = `${prefix}/${random}`;

    const existing = await prisma.student.findUnique({
      where: { registration_id: registrationId },
      select: { id: true },
    });

    if (!existing) {
      return registrationId;
    }
  }

  throw new Error("Could not generate a unique registration ID.");
}
