import { NextResponse } from "next/server";

import { assertOfferOpen } from "@/lib/flow";
import { checkScopedDuplicates } from "@/lib/student-service";
import { getRateLimitHeaders, isRateLimited } from "@/lib/rate-limit";
import { setRegistrationSession } from "@/lib/session";
import { validateRegistrationInput } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Check rate limiting
  const rateLimitResult = isRateLimited(request);
  const headers = getRateLimitHeaders(rateLimitResult);

  if (rateLimitResult.limited) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many registration attempts. Please try again later.",
      },
      { status: 429, headers },
    );
  }

  try {
    assertOfferOpen();
    const body = await request.json();
    const validated = validateRegistrationInput(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.errors },
        { status: 422 },
      );
    }

    const duplicateCheck = await checkScopedDuplicates(validated.data);
    if (!duplicateCheck.success) {
      return NextResponse.json(
        { success: false, errors: duplicateCheck.errors },
        { status: 409 },
      );
    }

    await setRegistrationSession(validated.data);

    return NextResponse.json(
      {
        success: true,
        message: "Registration data staged successfully.",
      },
      { headers },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_CLOSED") {
      return NextResponse.json(
        {
          success: false,
          message: "Registration period has ended.",
        },
        { status: 403 },
      );
    }

    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while saving registration data.",
      },
      { status: 500 },
    );
  }
}
