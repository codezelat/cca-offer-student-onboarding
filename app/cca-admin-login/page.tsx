import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { adminCopy } from "@/lib/content/admin";
import { getSession } from "@/lib/session";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session.admin_logged_in) {
    redirect("/cca-admin-area/dashboard");
  }

  return (
    <div className="page-frame">
      <div className="page-content">
        <SiteHeader />
        <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <section className="mx-auto w-full max-w-md rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-950">
              {adminCopy.login.title}
            </h1>
            <p className="mt-3 text-center text-sm leading-6 text-slate-600">
              {adminCopy.login.title}
            </p>
            <div className="mt-8">
              <AdminLoginForm />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
