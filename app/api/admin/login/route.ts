import { NextResponse } from "next/server";

import { adminCopy } from "@/lib/content/admin";
import {
  isAdminLoginRateLimited,
  recordAdminLoginAttempt,
  validateAdminCredentials,
} from "@/lib/admin-login-security";
import { setAdminSession } from "@/lib/session";
import { adminLoginSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let attemptedEmail = "";

  try {
    const body = await request.json();
    attemptedEmail =
      typeof body === "object" &&
      body !== null &&
      "email" in body &&
      typeof body.email === "string"
        ? body.email
        : "";

    if (await isAdminLoginRateLimited(request, attemptedEmail)) {
      await recordAdminLoginAttempt({
        request,
        email: attemptedEmail,
        success: false,
        reason: "rate_limited",
      });

      return NextResponse.json(
        { success: false, message: "Too many failed attempts. Try again later." },
        { status: 429 },
      );
    }

    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      await recordAdminLoginAttempt({
        request,
        email: attemptedEmail,
        success: false,
        reason: "validation_failed",
      });

      return NextResponse.json(
        { success: false, message: adminCopy.login.invalidCredentials },
        { status: 401 },
      );
    }

    if (!validateAdminCredentials(parsed.data.email, parsed.data.password)) {
      await recordAdminLoginAttempt({
        request,
        email: parsed.data.email,
        success: false,
        reason: "invalid_credentials",
      });

      return NextResponse.json(
        { success: false, message: adminCopy.login.invalidCredentials },
        { status: 401 },
      );
    }

    await setAdminSession(true);
    await recordAdminLoginAttempt({
      request,
      email: parsed.data.email,
      success: true,
      reason: "success",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    if (attemptedEmail) {
      await recordAdminLoginAttempt({
        request,
        email: attemptedEmail,
        success: false,
        reason: "server_error",
      }).catch(() => undefined);
    }

    return NextResponse.json(
      { success: false, message: adminCopy.login.invalidCredentials },
      { status: 500 },
    );
  }
}
