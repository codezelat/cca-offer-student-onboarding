import { createHash } from "node:crypto";

import { SignJWT, jwtVerify } from "jose";

import { env } from "@/lib/env";
import { getRegistrationGroupBaseId } from "@/lib/registration-groups";

const receiptAccessSecret = createHash("sha256")
  .update(`${env.sessionSecret}:receipt-access`)
  .digest();

type ReceiptAccessPayload = {
  scope: "receipt-access";
  registrationGroupId: string;
};

export async function createReceiptAccessToken(registrationId: string) {
  return new SignJWT({
    scope: "receipt-access",
    registrationGroupId: getRegistrationGroupBaseId(registrationId),
  } satisfies ReceiptAccessPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(receiptAccessSecret);
}

export async function hasReceiptAccess(input: {
  registrationId: string;
  token?: string | null;
  adminLoggedIn?: boolean;
}) {
  if (input.adminLoggedIn) {
    return true;
  }

  if (!input.token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(input.token, receiptAccessSecret);

    return (
      payload.scope === "receipt-access" &&
      payload.registrationGroupId === getRegistrationGroupBaseId(input.registrationId)
    );
  } catch {
    return false;
  }
}
