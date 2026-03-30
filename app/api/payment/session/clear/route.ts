import { NextResponse } from "next/server";

import { clearRegistrationSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  try {
    await clearRegistrationSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to clear session." },
      { status: 500 },
    );
  }
}
