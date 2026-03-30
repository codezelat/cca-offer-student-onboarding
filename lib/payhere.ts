import { createHash } from "node:crypto";

import { env } from "@/lib/env";

function md5(value: string) {
  return createHash("md5").update(value).digest("hex").toUpperCase();
}

export function getHashedMerchantSecret() {
  return md5(process.env.PAYHERE_MERCHANT_SECRET ?? env.payhereMerchantSecret);
}

export function generatePayHereStartHash(
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
) {
  return md5(
    `${merchantId}${orderId}${amount}${currency}${getHashedMerchantSecret()}`,
  );
}

export function generatePayHereNotifyHash(input: {
  merchant_id: string;
  order_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
}) {
  return md5(
    `${input.merchant_id}${input.order_id}${input.payhere_amount}${input.payhere_currency}${input.status_code}${getHashedMerchantSecret()}`,
  );
}


