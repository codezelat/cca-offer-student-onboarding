import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { getSession } from "@/lib/session";

export function validateAdminCredentials(email: string, password: string) {
  return email === env.adminUsername && password === env.adminPassword;
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session.admin_logged_in) {
    redirect("/cca-admin-login");
  }

  return session;
}
