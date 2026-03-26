import path from "node:path";

import { NextResponse } from "next/server";

import { assertOfferOpen, getRegistrationSessionOrRedirect } from "@/lib/flow";
import { completeSlipSubmission } from "@/lib/student-service";
import { clearRegistrationSession } from "@/lib/session";
import { saveSlipFile } from "@/lib/storage";

export const runtime = "nodejs";

const allowedExtensions = new Set(["jpg", "jpeg", "png", "pdf", "docx", "doc"]);

export async function POST(request: Request) {
  try {
    assertOfferOpen();
    const data = await getRegistrationSessionOrRedirect();
    const formData = await request.formData();
    const file = formData.get("payment_slip");

    if (!(file instanceof File)) {
      return NextResponse.redirect(new URL("/payment/upload-slip", request.url));
    }

    const extension = path.extname(file.name).slice(1).toLowerCase();
    if (!allowedExtensions.has(extension) || file.size > 10 * 1024 * 1024) {
      return NextResponse.redirect(new URL("/payment/upload-slip", request.url));
    }

    const safeRegistration = data.registration_id.replace(/[^A-Za-z0-9]+/g, "_");
    const filename = `slip_${safeRegistration}_${Date.now()}.${extension}`;
    await saveSlipFile(filename, Buffer.from(await file.arrayBuffer()));

    const student = await completeSlipSubmission(data, filename);
    await clearRegistrationSession();

    return NextResponse.redirect(
      new URL(`/payment/slip-success?student=${student.id}`, request.url),
    );
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_CLOSED") {
      return NextResponse.redirect(new URL("/offer-ended", request.url));
    }

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error(error);
    return NextResponse.redirect(new URL("/payment/upload-slip", request.url));
  }
}
