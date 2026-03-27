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
        <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <section className="mx-auto w-full max-w-md overflow-hidden rounded-[3rem] border border-neutral-100 bg-white p-10 shadow-premium group">
            <div className="flex flex-col items-center">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-900 text-white shadow-xl shadow-neutral-900/10">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-neutral-900">
                {adminCopy.login.title}
              </h1>
              <p className="mt-4 text-center text-sm font-semibold leading-relaxed text-neutral-500 uppercase tracking-widest">
                Authorized Access Only
              </p>
            </div>
            <div className="mt-12">
              <AdminLoginForm />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
