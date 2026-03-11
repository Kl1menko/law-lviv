import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaPool: Pool | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const pool =
    global.prismaPool ??
    new Pool({
      connectionString,
    });

  const adapter = new PrismaPg(pool);

  if (process.env.NODE_ENV !== "production") {
    global.prismaPool = pool;
  }

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export function getPrismaClient() {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }

  return global.prisma;
}
