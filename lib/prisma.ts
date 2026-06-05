import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Smart Prisma setup supporting easy migration:
// - Default: SQLite via fast adapter (./prisma/dev.db or DATABASE_URL="file:./...")
// - Cloud: PostgreSQL when DATABASE_URL starts with postgres://
// After changing DB, always: npx prisma generate && npx prisma db push
function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  const isPostgres = /^postgres(ql)?:\/\//i.test(databaseUrl);

  if (isPostgres) {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // SQLite local
  const sqliteUrl = databaseUrl.replace(/^file:/, "") || "./prisma/dev.db";
  const adapter = new PrismaBetterSqlite3({ url: sqliteUrl });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
