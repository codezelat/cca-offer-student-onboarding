import Link from "next/link";

import { AdminHeader } from "@/components/admin/admin-header";
import { DashboardTable } from "@/components/admin/dashboard-table";
import { adminCopy } from "@/lib/content/admin";
import { bootcamps } from "@/lib/config";
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

function buildPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const filtered = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | "ellipsis"> = [];
  for (const page of filtered) {
    const previous = items.at(-1);
    if (typeof previous === "number" && page - previous > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  }

  return items;
}

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
  const paginationItems = buildPaginationItems(result.page, result.totalPages);

  return (
    <div className="page-frame">
      <div className="page-content">
        <AdminHeader
          title="Dashboard"
          subtitle="Students, payments, exports"
          action={
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900 hover:bg-neutral-50 active:scale-[0.98]"
              >
                {adminCopy.dashboard.logout}
              </button>
            </form>
          }
        />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-premium overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-neutral-900">
                  {adminCopy.dashboard.title}
                </h1>
                <p className="mt-2 text-base font-semibold text-neutral-500 uppercase tracking-widest">
                  Student Enrollment Oversight
                </p>
              </div>
            </div>
            {params.updated ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Student updated successfully.
              </div>
            ) : null}
            <form className="mt-10 grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr_auto_auto_auto] items-end bg-neutral-50/50 p-6 rounded-3xl border border-neutral-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-3">Quick Search</label>
                <input
                  type="text"
                  name="search"
                  defaultValue={params.search}
                  placeholder={adminCopy.dashboard.searchPlaceholder}
                  className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-3">Filter Bootcamp</label>
                <select
                  name="diploma"
                  defaultValue={params.diploma ?? ""}
                  className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                >
                  <option value="">{adminCopy.dashboard.diplomaFilter}</option>
                  {bootcamps.map((bootcamp) => (
                    <option key={bootcamp} value={bootcamp}>
                      {bootcamp}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-3">Payment Method</label>
                <select
                  name="payment_method"
                  defaultValue={params.payment_method ?? ""}
                  className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                >
                  <option value="">{adminCopy.dashboard.paymentFilter}</option>
                  <option value="online">{adminCopy.dashboard.paymentOptions.online}</option>
                  <option value="slip">{adminCopy.dashboard.paymentOptions.slip}</option>
                  <option value="study_now_pay_later">
                    {adminCopy.dashboard.paymentOptions.study_now_pay_later}
                  </option>
                </select>
              </div>
              <button
                type="submit"
                className="rounded-full bg-neutral-900 px-10 py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-neutral-900/10 transition-all hover:bg-neutral-800 active:scale-[0.98]"
              >
                {adminCopy.dashboard.search}
              </button>
              <Link
                href="/cca-admin-area/dashboard"
                className="rounded-full border-2 border-neutral-200 bg-white px-10 py-5 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                {adminCopy.dashboard.clear}
              </Link>
              <a
                href={`/api/admin/export${queryString({
                  search: params.search,
                  diploma: params.diploma,
                  payment_method: params.payment_method,
                })}`}
                className="rounded-full border-2 border-indigo-100 bg-indigo-600 px-10 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
              >
                Export
              </a>
            </form>

            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-neutral-400 px-2">
              {adminCopy.dashboard.showing
                .replace("{first}", `${first}`)
                .replace("{last}", `${last}`)
                .replace("{total}", `${result.total}`)}
            </p>

            {result.students.length > 0 ? (
              <div className="mt-8">
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
              <div className="mt-8 rounded-[2.5rem] border-2 border-dashed border-neutral-100 bg-neutral-50/50 p-16 text-center">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
                  {adminCopy.dashboard.emptyTitle}
                </h2>
                <p className="mt-3 text-sm font-medium text-neutral-500">
                  {adminCopy.dashboard.emptyBody}
                </p>
              </div>
            )}

            {result.totalPages > 1 ? (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-neutral-100 pt-10">
                {result.page > 1 ? (
                  <Link
                    href={`/cca-admin-area/dashboard${queryString({
                      search: params.search,
                      diploma: params.diploma,
                      payment_method: params.payment_method,
                      page: `${result.page - 1}`,
                    })}`}
                    className="rounded-full border-2 border-neutral-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900"
                  >
                    {adminCopy.dashboard.previous}
                  </Link>
                ) : null}
                {paginationItems.map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-3 text-xs font-black uppercase tracking-widest text-neutral-300"
                    >
                      ...
                    </span>
                  ) : (
                    <Link
                      key={item}
                      href={`/cca-admin-area/dashboard${queryString({
                        search: params.search,
                        diploma: params.diploma,
                        payment_method: params.payment_method,
                        page: `${item}`,
                      })}`}
                      className={`rounded-full px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                        item === result.page
                          ? "bg-neutral-900 text-white shadow-xl shadow-neutral-900/20"
                          : "border-2 border-neutral-100 bg-white text-neutral-400 hover:border-neutral-900 hover:text-neutral-900"
                      }`}
                    >
                      {item}
                    </Link>
                  ),
                )}
                {result.page < result.totalPages ? (
                  <Link
                    href={`/cca-admin-area/dashboard${queryString({
                      search: params.search,
                      diploma: params.diploma,
                      payment_method: params.payment_method,
                      page: `${result.page + 1}`,
                    })}`}
                    className="rounded-full border-2 border-neutral-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900"
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
