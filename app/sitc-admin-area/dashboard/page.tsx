import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { DashboardTable } from "@/components/admin/dashboard-table";
import { adminCopy } from "@/lib/content/admin";
import { diplomas } from "@/lib/config";
import { requireAdminSession } from "@/lib/auth";
import { getDashboardStudents } from "@/lib/student-service";

type Props = {
  searchParams: Promise<{
    search?: string;
    diploma?: string;
    payment_method?: string;
    page?: string;
    updated?: string;
  }>;
};

function queryString(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  await requireAdminSession();
  const params = await searchParams;
  const currentPage = Number(params.page ?? "1");

  const result = await getDashboardStudents({
    search: params.search,
    diploma: params.diploma,
    payment_method: params.payment_method,
    page: currentPage,
    perPage: 10,
  });

  const first = result.total === 0 ? 0 : (result.page - 1) * result.perPage + 1;
  const last = Math.min(result.page * result.perPage, result.total);

  return (
    <div className="page-frame">
      <div className="page-content">
        <SiteHeader
          admin
          title={adminCopy.dashboard.title}
          action={
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-900"
              >
                {adminCopy.dashboard.logout}
              </button>
            </form>
          }
        />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {adminCopy.dashboard.title}
            </h1>
            {params.updated ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Student updated successfully.
              </div>
            ) : null}
            <form className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_auto_auto_auto]">
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder={adminCopy.dashboard.searchPlaceholder}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <select
                name="diploma"
                defaultValue={params.diploma ?? ""}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              >
                <option value="">{adminCopy.dashboard.diplomaFilter}</option>
                {diplomas.map((diploma) => (
                  <option key={diploma.code} value={diploma.full_name}>
                    {diploma.full_name}
                  </option>
                ))}
              </select>
              <select
                name="payment_method"
                defaultValue={params.payment_method ?? ""}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              >
                <option value="">{adminCopy.dashboard.paymentFilter}</option>
                <option value="online">{adminCopy.dashboard.paymentOptions.online}</option>
                <option value="slip">{adminCopy.dashboard.paymentOptions.slip}</option>
                <option value="study_now_pay_later">
                  {adminCopy.dashboard.paymentOptions.study_now_pay_later}
                </option>
              </select>
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                {adminCopy.dashboard.search}
              </button>
              <Link
                href="/sitc-admin-area/dashboard"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                {adminCopy.dashboard.clear}
              </Link>
              <a
                href={`/api/admin/export${queryString({
                  search: params.search,
                  diploma: params.diploma,
                  payment_method: params.payment_method,
                })}`}
                className="rounded-full border border-blue-300 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-800"
              >
                Export
              </a>
            </form>

            <p className="mt-5 text-sm text-slate-600">
              {adminCopy.dashboard.showing
                .replace("{first}", `${first}`)
                .replace("{last}", `${last}`)
                .replace("{total}", `${result.total}`)}
            </p>

            {result.students.length > 0 ? (
              <div className="mt-6">
                <DashboardTable
                  students={result.students.map((student) => ({
                    id: student.id,
                    registration_id: student.registration_id,
                    full_name: student.full_name,
                    name_with_initials: student.name_with_initials,
                    selected_diploma: student.selected_diploma,
                    nic: student.nic,
                    whatsapp_number: student.whatsapp_number,
                    email: student.email,
                    district: student.district,
                    payment_method: student.payment_method,
                    payment_status: student.payment_status,
                    payment_slip: student.payment_slip,
                    amount_paid: student.amount_paid?.toString() ?? null,
                  }))}
                />
              </div>
            ) : (
              <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-950">
                  {adminCopy.dashboard.emptyTitle}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {adminCopy.dashboard.emptyBody}
                </p>
              </div>
            )}

            {result.totalPages > 1 ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {result.page > 1 ? (
                  <Link
                    href={`/sitc-admin-area/dashboard${queryString({
                      search: params.search,
                      diploma: params.diploma,
                      payment_method: params.payment_method,
                      page: `${result.page - 1}`,
                    })}`}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                  >
                    {adminCopy.dashboard.previous}
                  </Link>
                ) : null}
                {Array.from({ length: result.totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <Link
                      key={page}
                      href={`/sitc-admin-area/dashboard${queryString({
                        search: params.search,
                        diploma: params.diploma,
                        payment_method: params.payment_method,
                        page: `${page}`,
                      })}`}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        page === result.page
                          ? "bg-slate-950 text-white"
                          : "border border-slate-300 bg-white text-slate-900"
                      }`}
                    >
                      {page}
                    </Link>
                  ),
                )}
                {result.page < result.totalPages ? (
                  <Link
                    href={`/sitc-admin-area/dashboard${queryString({
                      search: params.search,
                      diploma: params.diploma,
                      payment_method: params.payment_method,
                      page: `${result.page + 1}`,
                    })}`}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                  >
                    {adminCopy.dashboard.next}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}
