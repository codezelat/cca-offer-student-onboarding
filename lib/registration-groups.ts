import type { Prisma } from "@/generated/postgres/client";

export function getRegistrationGroupBaseId(registrationId: string) {
  return registrationId.replace(/-\d+$/, "");
}

export function getRegistrationGroupWhere(
  registrationId: string,
): Prisma.StudentWhereInput {
  const baseRegistrationId = getRegistrationGroupBaseId(registrationId);

  return {
    OR: [
      { registration_id: baseRegistrationId },
      { registration_id: { startsWith: `${baseRegistrationId}-` } },
    ],
  };
}
