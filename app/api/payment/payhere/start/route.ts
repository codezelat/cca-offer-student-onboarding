import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { assertOfferOpen, getRegistrationSessionOrRedirect } from "@/lib/flow";
import { generatePayHereStartHash } from "@/lib/payhere";
import { getPayHereUrls, buildPayHereOrder } from "@/lib/student-service";
import { getSession, saveSession } from "@/lib/session";
import { extractLastName } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST() {
  try {
    assertOfferOpen();
    const data = await getRegistrationSessionOrRedirect();
    const order = await buildPayHereOrder(data);
    const session = await getSession();
    const urls = getPayHereUrls();
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

    return NextResponse.json({
      success: true,
      redirectUrl: "/payment/payhere",
      payment,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_CLOSED") {
      return NextResponse.json(
        { success: false, message: "Registration period has ended." },
        { status: 403 },
      );
    }

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to initialize PayHere payment." },
      { status: 500 },
    );
  }
}
