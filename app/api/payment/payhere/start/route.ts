import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { assertOfferOpen, getRegistrationSessionOrRedirect } from "@/lib/flow";
import { generatePayHereStartHash } from "@/lib/payhere";
import { getPayHereUrls, buildPayHereOrder } from "@/lib/student-service";
import { getSession, saveSession } from "@/lib/session";
import { extractLastName } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertOfferOpen();
    const data = await getRegistrationSessionOrRedirect();
    const order = await buildPayHereOrder(data);
    const session = await getSession();
    const urls = getPayHereUrls(new URL(request.url).origin);
    const payment = {
      sandbox: env.payhereSandbox,
      merchant_id: env.payhereMerchantId,
      return_url: urls.returnUrl,
      cancel_url: urls.cancelUrl,
      notify_url: urls.notifyUrl,
      order_id: order.orderId,
      items: order.itemName,
      amount: order.amount,
      currency: "LKR",
      first_name: order.firstName,
      last_name: extractLastName(data.full_name),
      email: data.email,
      phone: data.whatsapp_number,
      address: data.permanent_address,
      city: data.district,
      country: "Sri Lanka",
      custom_1: data.registration_id,
      hash: generatePayHereStartHash(
        env.payhereMerchantId,
        order.orderId,
        order.amount,
        "LKR",
      ),
    };

    await saveSession({
      ...session,
      payhere_order_id: order.orderId,
      payhere_payment: payment,
    });

    return NextResponse.redirect(new URL("/payment/payhere", request.url));
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
