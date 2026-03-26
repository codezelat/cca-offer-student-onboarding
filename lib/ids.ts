import type { PrismaClient } from "@/generated/sqlite/client";

import { getDiplomaByName } from "@/lib/config";

export async function generateRegistrationId(
  prisma: PrismaClient,
  diplomaName: string,
) {
  const diploma = getDiplomaByName(diplomaName);
  if (!diploma) {
    throw new Error(`Unsupported diploma for registration ID: ${diplomaName}`);
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const random = `${Math.floor(Math.random() * 100000000)}`.padStart(8, "0");
    const registrationId = `${diploma.reg_prefix}/${random}`;

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
