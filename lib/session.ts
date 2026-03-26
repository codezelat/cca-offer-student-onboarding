import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";

import { SESSION_COOKIE_NAME } from "@/lib/config";
import { env } from "@/lib/env";
import type { RegistrationData, SessionPayload } from "@/lib/types";

const secret = new TextEncoder().encode(env.sessionSecret.padEnd(32, "0").slice(0, 32));

async function encodeSession(payload: SessionPayload) {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .encrypt(secret);
}

async function decodeSession(value: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtDecrypt(value, secret);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) {
    return {};
  }

  return (await decodeSession(raw)) ?? {};
}

export async function saveSession(payload: SessionPayload) {
  const token = await encodeSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function setRegistrationSession(data: RegistrationData) {
  const session = await getSession();
  await saveSession({
    ...session,
    registration_data: data,
    registration_id: data.registration_id,
    current_step: 2,
  });
}

export async function clearRegistrationSession() {
  const session = await getSession();
  delete session.registration_data;
  delete session.registration_id;
  delete session.current_step;
  delete session.payhere_order_id;
  delete session.payhere_payment;
  await saveSession(session);
}

export async function setAdminSession(value: boolean) {
  const session = await getSession();
  await saveSession({
    ...session,
    admin_logged_in: value,
  });
}
