import { NextResponse } from "next/server";

import { assertOfferOpen, getRegistrationSessionOrRedirect } from "@/lib/flow";
import { completeStudyNowPayLater } from "@/lib/student-service";
import { clearRegistrationSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertOfferOpen();
    const data = await getRegistrationSessionOrRedirect();
    const student = await completeStudyNowPayLater(data);
    await clearRegistrationSession();

    return NextResponse.redirect(
      new URL(`/registration-success?student=${student.id}`, request.url),
    );
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_CLOSED") {
      return NextResponse.redirect(new URL("/offer-ended", request.url));
    }

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error(error);
    return NextResponse.redirect(new URL("/payment/options", request.url));
  }
}
