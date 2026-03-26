import "dotenv/config";

import path from "node:path";

import { defineConfig } from "prisma/config";

function resolveSqliteDatabaseUrl() {
  const value = process.env.DATABASE_URL ?? "file:./prisma/sqlite/dev.db";

  if (!value.startsWith("file:")) {
    return value;
  }

  const filePath = value.slice("file:".length);
  if (path.isAbsolute(filePath)) {
    return value;
  }

  return `file:${path.resolve(/* turbopackIgnore: true */ process.cwd(), filePath)}`;
}

export default defineConfig({
  schema: "prisma/sqlite/schema.prisma",
  migrations: {
    path: "prisma/sqlite/migrations",
  },
  datasource: {
    url: resolveSqliteDatabaseUrl(),
  },
});
