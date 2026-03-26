import { NextResponse } from "next/server";

import { clearRegistrationSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  await clearRegistrationSession();
  return NextResponse.json({ success: true });
}
