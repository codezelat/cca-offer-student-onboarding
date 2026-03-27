import { NextResponse } from "next/server";

import { setAdminSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await setAdminSession(false);
  return NextResponse.redirect(new URL("/", request.url));
}
