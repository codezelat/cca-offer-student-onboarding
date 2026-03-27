import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/postgres/schema.prisma",
  migrations: {
    path: "prisma/postgres/migrations",
  },
  datasource: {
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL_UNPOOLED ??
      process.env.POSTGRES_URL_NON_POOLING ??
      process.env.DATABASE_URL ??
      process.env.POSTGRES_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/cca_offer_student_onboarding?schema=public",
  },
});
