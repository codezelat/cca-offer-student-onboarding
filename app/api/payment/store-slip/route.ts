import { NextResponse } from "next/server";
import { z } from "zod";

import { assertOfferOpen, getRegistrationSessionOrRedirect } from "@/lib/flow";
import { createReceiptAccessToken } from "@/lib/receipt-access";
import { completeSlipSubmission } from "@/lib/student-service";
import { clearRegistrationSession } from "@/lib/session";
import { validateUploadedSlip } from "@/lib/storage";

export const runtime = "nodejs";

const uploadedSlipSchema = z.object({
  pathname: z.string().min(1),
  url: z.string().url(),
  size: z.number().int().positive(),
  contentType: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    assertOfferOpen();
    const data = await getRegistrationSessionOrRedirect();
    const payload = uploadedSlipSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json(
        { success: false, message: "Invalid uploaded slip reference." },
        { status: 422 },
      );
    }

    const blob = await validateUploadedSlip(payload.data, data.registration_id);
    const student = await completeSlipSubmission(data, blob.pathname);
    const receiptToken = await createReceiptAccessToken(student.registration_id);
    await clearRegistrationSession();

    return NextResponse.json(
      {
        success: true,
        redirectTo: `/payment/slip-success?student=${student.id}&token=${encodeURIComponent(receiptToken)}`,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_CLOSED") {
      return NextResponse.json(
        {
          success: false,
          redirectTo: "/offer-ended",
        },
        { status: 403 },
      );
    }

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to save payment slip.",
      },
      { status: 500 },
    );
  }
}
