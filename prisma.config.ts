import "dotenv/config";

import { defineConfig } from "prisma/config";

function requireDatasourceUrl() {
  const url =
    process.env.DIRECT_URL ??
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL;

  if (!url) {
    throw new Error("Missing required database connection environment variable.");
  }

  return url;
}

export default defineConfig({
  schema: "prisma/postgres/schema.prisma",
  migrations: {
    path: "prisma/postgres/migrations",
  },
  datasource: {
    url: requireDatasourceUrl(),
  },
});
