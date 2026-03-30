import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
    status: "healthy",
  };

  try {
    // Check database connectivity with a simple query
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    checks.status = "unhealthy";
    console.error("Health check failed - database error:", error);
  }

  const isHealthy = checks.status === "healthy";

  return NextResponse.json(checks, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
