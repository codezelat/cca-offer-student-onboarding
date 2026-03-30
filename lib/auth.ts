import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

export async function requireAdminSession() {
  const session = await getSession();
  if (!session.admin_logged_in) {
    redirect("/cca-admin-login");
  }

  return session;
}
