import { generatePayHereNotifyHash } from "@/lib/payhere";
import { completeOnlinePayment } from "@/lib/student-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload = {
      merchant_id: `${formData.get("merchant_id") ?? ""}`,
      order_id: `${formData.get("order_id") ?? ""}`,
      payhere_amount: `${formData.get("payhere_amount") ?? ""}`,
      payhere_currency: `${formData.get("payhere_currency") ?? ""}`,
      status_code: `${formData.get("status_code") ?? ""}`,
      md5sig: `${formData.get("md5sig") ?? ""}`.toUpperCase(),
      custom_1: `${formData.get("custom_1") ?? ""}`,
    };

    const validSignature =
      generatePayHereNotifyHash(payload) === payload.md5sig &&
      payload.status_code === "2";

    if (validSignature) {
      await completeOnlinePayment({
        registrationId: payload.custom_1,
        orderId: payload.order_id,
        amount: payload.payhere_amount,
      });
    }
  } catch (error) {
    console.error(error);
  }

  return new Response("OK", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
