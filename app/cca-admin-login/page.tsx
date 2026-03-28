import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
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
        <AdminHeader
          title="Admin Login"
          subtitle="Authorized access only"
          homeHref="/cca-admin-login"
        />
        <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <section className="mx-auto w-full max-w-md overflow-hidden rounded-[2.5rem] border border-neutral-100 bg-white p-12 shadow-premium">
            <div className="flex flex-col items-center">
              <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-neutral-900 uppercase italic">
                {adminCopy.login.title}
              </h1>
              <p className="mt-4 text-center text-xs font-black leading-relaxed text-neutral-400 uppercase tracking-[0.3em]">
                Authorized Access Only
              </p>
            </div>
            <div className="mt-14">
              <AdminLoginForm />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
