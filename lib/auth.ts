import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";
import { validateAdminCredentials as validateCredentials } from "@/lib/admin-login-security";

export function validateAdminCredentials(email: string, password: string) {
  return validateCredentials(email, password);
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session.admin_logged_in) {
    redirect("/cca-admin-login");
  }

  return session;
}
