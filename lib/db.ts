import path from "node:path";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "@/generated/sqlite/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

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

const databaseUrl = resolveSqliteDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3(
      { url: databaseUrl },
      {
        // Preserve compatibility with the existing SQLite timestamp encoding.
        timestampFormat: "unixepoch-ms",
      },
    ),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
