import { NextResponse } from "next/server";

import { assertOfferOpen, getRegistrationSessionOrRedirect } from "@/lib/flow";
import { createReceiptAccessToken } from "@/lib/receipt-access";
import { completeStudyNowPayLater } from "@/lib/student-service";
import { clearRegistrationSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertOfferOpen();
    const data = await getRegistrationSessionOrRedirect();
    const student = await completeStudyNowPayLater(data);
    const receiptToken = await createReceiptAccessToken(student.registration_id);
    await clearRegistrationSession();

    return NextResponse.redirect(
      new URL(
        `/registration-success?student=${student.id}&token=${encodeURIComponent(receiptToken)}`,
        request.url,
      ),
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
