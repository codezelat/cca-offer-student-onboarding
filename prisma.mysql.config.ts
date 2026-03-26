import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/mysql/schema.prisma",
  migrations: {
    path: "prisma/mysql/migrations",
  },
  datasource: {
    url:
      process.env.MYSQL_DATABASE_URL ??
      "mysql://user:password@localhost:3306/sitc_offer",
  },
});
