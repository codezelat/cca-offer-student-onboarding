import { redirect } from "next/navigation";

import { isOfferExpired } from "@/lib/deadline";
import { getSession } from "@/lib/session";

export async function getRegistrationSessionOrRedirect() {
  const session = await getSession();
  if (!session.registration_data) {
    redirect("/select-diploma");
  }

  return session.registration_data;
}

export function assertOfferOpen() {
  if (isOfferExpired()) {
    throw new Error("REGISTRATION_CLOSED");
  }
}
