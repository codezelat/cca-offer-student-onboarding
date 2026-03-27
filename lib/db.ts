import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/generated/postgres/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    "postgresql://postgres:postgres@127.0.0.1:5432/cca_offer_student_onboarding?schema=public"
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString: getDatabaseUrl() }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
