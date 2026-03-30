import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { ApproveSlipButton } from "@/components/admin/approve-slip-button";
import { StudentRecordDeleteButton } from "@/components/admin/student-record-delete-button";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getRegistrationGroupWhere } from "@/lib/registration-groups";
import {
  digitsOnly,
  formatBirthDate,
  formatCurrency,
  formatSimpleDate,
} from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
};

function formatPaymentMethod(value: string | null) {
  if (!value) {
    return "Not selected";
  }

  if (value === "study_now_pay_later") {
    return "Study Now Pay Later";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function paymentTone(status: string) {
  if (status === "completed") {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (status === "pending_exam_fee") {
    return "border-sky-100 bg-sky-50 text-sky-700";
  }

  return "border-amber-100 bg-amber-50 text-amber-700";
}

function paymentStatusLabel(
  paymentMethod: string | null,
  paymentStatus: string,
) {
  if (paymentMethod === "slip") {
    return paymentStatus === "completed" ? "Slip approved" : "Slip pending";
  }

  return paymentStatus.replaceAll("_", " ");
}

export default async function AdminStudentDetailPage({
  params,
  searchParams,
}: Props) {
  await requireAdminSession();
  const { id } = await params;
  const { updated } = await searchParams;
  const studentId = Number(id);

  if (!studentId) {
    notFound();
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    notFound();
  }

  const relatedRecords = await prisma.student.findMany({
    where: getRegistrationGroupWhere(student.registration_id),
    orderBy: { registration_id: "asc" },
  });

  const receiptHref = `/payment/receipt/${student.id}`;
  const slipHref = student.payment_slip ? `/files/slips/${student.id}` : null;
  const whatsappHref = `https://wa.me/94${digitsOnly(student.whatsapp_number).replace(/^0/, "")}`;
  const totalAmount = formatCurrency(
    relatedRecords.reduce(
      (sum, record) => sum + Number(record.amount_paid ?? 0),
      0,
    ),
  );

  return (
    <div className="page-frame">
      <div className="page-content">
        <AdminHeader
          title="Student Record"
          subtitle={student.registration_id}
          action={
            <div className="flex items-center gap-3">
              <Link
                href={`/cca-admin-area/student/${student.id}/edit`}
                className="rounded-full bg-neutral-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-[0.98] shadow-lg shadow-neutral-900/10"
              >
                Edit
              </Link>
              <StudentRecordDeleteButton
                studentId={student.id}
                studentName={student.full_name}
              />
            </div>
          }
        />

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-premium sm:p-14">
            {updated ? (
              <div className="mb-8 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
                Student record updated successfully.
              </div>
            ) : null}

            <div className="flex min-w-0 flex-col gap-8 border-b border-neutral-100 pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                  {student.registration_id}
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
                  {student.full_name}
                </h1>
                <p className="mt-3 text-base font-medium text-neutral-500">
                  {student.email} • {student.whatsapp_number}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span
                    className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${paymentTone(
                      student.payment_status,
                    )}`}
                  >
                    {paymentStatusLabel(
                      student.payment_method,
                      student.payment_status,
                    )}
                  </span>
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-700">
                    {formatPaymentMethod(student.payment_method)}
                  </span>
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-700">
                    {student.selected_diploma}
                  </span>
                </div>
              </div>

              <div className="grid min-w-0 gap-4 sm:grid-cols-3">
                <MetricCard
                  label="Programs"
                  value={`${relatedRecords.length}`}
                />
                <MetricCard
                  label="Paid"
                  value={formatCurrency(student.amount_paid?.toString() ?? 0)}
                />
                <MetricCard label="Group total" value={totalAmount} />
              </div>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <section className="rounded-[2rem] border border-neutral-100 bg-neutral-50/40 p-8">
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                    Student details
                  </h2>
                  <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoCard
                      label="Name With Initials"
                      value={student.name_with_initials}
                    />
                    <InfoCard label="NIC" value={student.nic} mono />
                    <InfoCard
                      label="Date of Birth"
                      value={formatBirthDate(student.date_of_birth)}
                    />
                    <InfoCard label="Gender" value={student.gender} />
                    <InfoCard label="District" value={student.district} />
                    <InfoCard
                      label="Postal Code"
                      value={student.postal_code ?? "-"}
                    />
                    <InfoCard
                      label="WhatsApp"
                      value={student.whatsapp_number}
                    />
                    <InfoCard
                      label="Emergency Contact"
                      value={student.home_contact_number}
                    />
                    <InfoCard
                      label="Address"
                      value={student.permanent_address}
                      fullWidth
                    />
                  </dl>
                </section>

                <section className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                      Programs
                    </h2>
                    <Link
                      href={`/cca-admin-area/student/${student.id}/edit`}
                      className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900"
                    >
                      Edit current row
                    </Link>
                  </div>

                  <div className="mt-6 space-y-3">
                    {relatedRecords.map((record) => {
                      const isCurrent = record.id === student.id;

                      return (
                        <Link
                          key={record.id}
                          href={`/cca-admin-area/student/${record.id}${isCurrent ? "/edit" : ""}`}
                          className={`block rounded-[1.5rem] border p-5 transition-all ${
                            isCurrent
                              ? "border-neutral-900 bg-neutral-900 text-white shadow-xl shadow-neutral-900/10"
                              : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-900 hover:bg-white"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="break-words text-base font-black tracking-tight">
                                {record.selected_diploma}
                              </p>
                              <p
                                className={`mt-2 break-all text-xs font-bold uppercase tracking-widest ${
                                  isCurrent
                                    ? "text-white/65"
                                    : "text-neutral-500"
                                }`}
                              >
                                {record.registration_id}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span
                                className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                  isCurrent
                                    ? "border-white/15 bg-white/10 text-white"
                                    : paymentTone(record.payment_status)
                                }`}
                              >
                                {paymentStatusLabel(
                                  record.payment_method,
                                  record.payment_status,
                                )}
                              </span>
                              <span
                                className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                  isCurrent
                                    ? "border-white/15 bg-white/10 text-white"
                                    : "border-neutral-200 bg-white text-neutral-700"
                                }`}
                              >
                                {formatPaymentMethod(record.payment_method)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <section className="rounded-[2rem] border border-neutral-100 bg-neutral-900 p-8 text-white shadow-2xl">
                  <h2 className="text-2xl font-black tracking-tight">
                    Payment
                  </h2>
                  <div className="mt-6 grid gap-4">
                    <SidebarLine
                      label="Amount Paid"
                      value={formatCurrency(
                        student.amount_paid?.toString() ?? 0,
                      )}
                    />
                    <SidebarLine
                      label="Payment Date"
                      value={formatSimpleDate(student.payment_date)}
                    />
                    <SidebarLine
                      label="PayHere Order"
                      value={student.payhere_order_id ?? "Not available"}
                      mono
                    />
                    <SidebarLine
                      label="Created"
                      value={formatSimpleDate(student.created_at)}
                    />
                    <SidebarLine
                      label="Updated"
                      value={formatSimpleDate(student.updated_at)}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Primary Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={receiptHref}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-[11px] font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/10"
                      >
                        <svg
                          className="h-4 w-4 transition-transform group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </a>
                      <a
                        href={`${receiptHref}?download=true`}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-transparent px-4 py-3.5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white/40"
                      >
                        <svg
                          className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        PDF
                      </a>
                    </div>

                    {/* Slip Section - Only when exists */}
                    {slipHref ? (
                      <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/20">
                              <svg
                                className="h-5 w-5 text-indigo-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
                                Payment Slip
                              </p>
                              <p className="text-xs font-medium text-indigo-100/70">
                                Uploaded
                              </p>
                            </div>
                          </div>
                          <a
                            href={slipHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-400/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-100 transition-all hover:bg-indigo-400/30"
                          >
                            View
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                        {student.payment_method === "slip" &&
                        student.payment_status === "pending" ? (
                          <div className="mt-3 border-t border-indigo-400/20 pt-3">
                            <ApproveSlipButton studentId={student.id} />
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Contact Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${student.email}`}
                        className="group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:bg-white/10 hover:text-white"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Email
                      </a>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:bg-white/10 hover:text-white"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 9.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[1.5rem] border border-neutral-100 bg-neutral-50/50 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </p>
      <p className="mt-3 break-words text-2xl font-black tracking-tight text-neutral-900">
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  label,
  value,
  mono = false,
  fullWidth = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border border-neutral-100 bg-white p-5 shadow-sm ${fullWidth ? "sm:col-span-2 xl:col-span-3" : ""}`}
    >
      <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </dt>
      <dd
        className={`mt-3 whitespace-pre-wrap text-base font-bold text-neutral-900 ${
          mono ? "break-all font-mono text-sm" : "break-words"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function SidebarLine({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p
        className={`mt-2 whitespace-pre-wrap text-sm font-bold text-white ${
          mono ? "break-all font-mono" : "break-words"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
