import { NextResponse } from "next/server";

import { adminCopy } from "@/lib/content/admin";
import { setAdminSession } from "@/lib/session";
import { validateAdminCredentials } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: adminCopy.login.invalidCredentials },
        { status: 401 },
      );
    }

    if (!validateAdminCredentials(parsed.data.email, parsed.data.password)) {
      return NextResponse.json(
        { success: false, message: adminCopy.login.invalidCredentials },
        { status: 401 },
      );
    }

    await setAdminSession(true);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: adminCopy.login.invalidCredentials },
      { status: 500 },
    );
  }
}
