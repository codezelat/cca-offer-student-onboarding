import type { PrismaClient } from "@/generated/postgres/client";

import { BOOTCAMP_REG_PREFIX } from "@/lib/config";

export async function generateRegistrationId(
  prisma: PrismaClient,
  bootcampNames: string[],
) {
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

export async function generateStudentId(prisma: PrismaClient, at = new Date()) {
  const year = at.getFullYear();
  const prefix = `${year}-std-`;

  const latest = await prisma.student.findFirst({
    where: {
      student_id: {
        startsWith: prefix,
      },
    },
    orderBy: {
      student_id: "desc",
    },
    select: {
      student_id: true,
    },
  });

  const current = latest?.student_id?.split("-").at(-1);
  const nextNumber = current ? Number(current) + 1 : 2101;
  return `${prefix}${`${nextNumber}`.padStart(4, "0")}`;
}
