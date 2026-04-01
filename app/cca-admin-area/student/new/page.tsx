import { AdminHeader } from "@/components/admin/admin-header";
import { AdminCreateForm } from "@/components/forms/admin-create-form";
import { requireAdminSession } from "@/lib/auth";
import { bootcamps, districts } from "@/lib/config";
import { adminCopy } from "@/lib/content/admin";

export default async function AdminCreateStudentPage() {
  await requireAdminSession();

  return (
    <div className="page-frame">
      <div className="page-content">
        <AdminHeader title="Add Record" subtitle="Create a manual registration" />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-premium sm:p-14">
            <div className="border-b border-neutral-100 pb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                Admin create
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
                {adminCopy.create.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base font-medium text-neutral-500">
                {adminCopy.create.subtitle}
              </p>
            </div>

            <div className="mt-8">
              <AdminCreateForm districts={districts} bootcamps={bootcamps} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
