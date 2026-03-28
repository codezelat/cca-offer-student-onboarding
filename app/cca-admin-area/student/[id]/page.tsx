import Link from "next/link";
import { notFound } from "next/navigation";

import { StudentRecordDeleteButton } from "@/components/admin/student-record-delete-button";
import { SiteHeader } from "@/components/site-header";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getRegistrationGroupWhere } from "@/lib/registration-groups";
import { digitsOnly, formatBirthDate, formatCurrency, formatSimpleDate } from "@/lib/utils";

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
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (status === "pending_exam_fee") {
    return "bg-sky-50 text-sky-700 border-sky-100";
  }

  return "bg-amber-50 text-amber-700 border-amber-100";
}

export default async function AdminStudentDetailPage({ params, searchParams }: Props) {
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

  const otherRecords = relatedRecords.filter((record) => record.id !== student.id);
  const primaryAmount = student.amount_paid ? formatCurrency(student.amount_paid.toString()) : formatCurrency(0);
  const totalAmount = formatCurrency(
    relatedRecords.reduce((sum, record) => sum + Number(record.amount_paid ?? 0), 0),
  );
  const receiptHref = `/payment/receipt/${student.id}`;
  const slipHref = student.payment_slip ? `/files/slips/${student.id}` : null;
  const whatsappHref = `https://wa.me/94${digitsOnly(student.whatsapp_number).replace(/^0/, "")}`;

  return (
    <div className="page-frame">
      <div className="page-content">
        <SiteHeader
          admin
          title="Enrollment Record"
          action={
            <div className="flex items-center gap-3">
              <Link
                href="/cca-admin-area/dashboard"
                className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                Dashboard
              </Link>
              <Link
                href={`/cca-admin-area/student/${student.id}/edit`}
                className="rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98] shadow-lg shadow-neutral-900/10"
              >
                Edit Record
              </Link>
              <StudentRecordDeleteButton
                studentId={student.id}
                studentName={student.full_name}
              />
            </div>
          }
        />

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-premium sm:p-14">
            {updated ? (
              <div className="mb-8 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
                Student record updated successfully.
              </div>
            ) : null}
            <div className="flex flex-col gap-8 border-b border-neutral-100 pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                  Enrollment Profile
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
                  {student.full_name}
                </h1>
                <p className="mt-3 text-base font-medium text-neutral-500">
                  {student.name_with_initials} • {student.email}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {relatedRecords.map((record) => (
                    <span
                      key={record.registration_id}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-neutral-700"
                    >
                      {record.registration_id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard label="Programs" value={`${relatedRecords.length}`} />
                <MetricCard label="Current Row Paid" value={primaryAmount} />
                <MetricCard label="Group Total" value={totalAmount} />
              </div>
            </div>

            <div className="mt-10 grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
              <div className="space-y-8">
                <section className="rounded-[2rem] border border-neutral-100 bg-neutral-50/40 p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                        Shared Student Profile
                      </h2>
                      <p className="mt-2 text-sm font-medium text-neutral-500">
                        These identity and contact details are shared across every program row in the same registration group.
                      </p>
                    </div>
                    <Link
                      href={`/cca-admin-area/student/${student.id}/edit`}
                      className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900"
                    >
                      Edit Shared Data
                    </Link>
                  </div>

                  <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoCard label="NIC" value={student.nic} mono />
                    <InfoCard label="Date of Birth" value={formatBirthDate(student.date_of_birth)} />
                    <InfoCard label="Gender" value={student.gender} />
                    <InfoCard label="WhatsApp" value={student.whatsapp_number} />
                    <InfoCard label="Emergency Contact" value={student.home_contact_number} />
                    <InfoCard label="District" value={student.district} />
                    <InfoCard label="Postal Code" value={student.postal_code ?? "-"} />
                    <InfoCard label="Terms Accepted" value={student.terms_accepted ? "Yes" : "No"} />
                    <InfoCard label="Permanent Address" value={student.permanent_address} fullWidth />
                  </dl>
                </section>

                <section className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                    Program Rows In This Registration
                  </h2>
                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    Program assignment is row-specific. Shared personal details update across the whole group.
                  </p>

                  <div className="mt-8 grid gap-4">
                    {relatedRecords.map((record) => {
                      const isCurrent = record.id === student.id;
                      return (
                        <div
                          key={record.id}
                          className={`rounded-[1.75rem] border p-6 transition-all ${
                            isCurrent
                              ? "border-neutral-900 bg-neutral-900 text-white shadow-xl shadow-neutral-900/10"
                              : "border-neutral-100 bg-neutral-50/50"
                          }`}
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-xl font-black tracking-tight">
                                  {record.selected_diploma}
                                </h3>
                                {isCurrent ? (
                                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                    Current row
                                  </span>
                                ) : null}
                              </div>
                              <p className={`mt-2 text-sm font-medium ${isCurrent ? "text-white/70" : "text-neutral-500"}`}>
                                {record.registration_id} • {record.student_id ?? "Student ID pending"}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <span
                                className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                                  isCurrent
                                    ? "border-white/15 bg-white/10 text-white"
                                    : paymentTone(record.payment_status)
                                }`}
                              >
                                {record.payment_status.replaceAll("_", " ")}
                              </span>
                              <span
                                className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                                  isCurrent
                                    ? "border-white/15 bg-white/10 text-white"
                                    : "border-neutral-200 bg-white text-neutral-700"
                                }`}
                              >
                                {formatPaymentMethod(record.payment_method)}
                              </span>
                              <Link
                                href={`/cca-admin-area/student/${record.id}${isCurrent ? "/edit" : ""}`}
                                className={`rounded-full px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                  isCurrent
                                    ? "bg-white text-neutral-900"
                                    : "border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-900"
                                }`}
                              >
                                {isCurrent ? "Edit this row" : "Open row"}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                    System Timeline
                  </h2>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoCard label="Created" value={formatSimpleDate(student.created_at)} />
                    <InfoCard label="Updated" value={formatSimpleDate(student.updated_at)} />
                    <InfoCard label="Payment Date" value={formatSimpleDate(student.payment_date)} />
                    <InfoCard label="PayHere Order" value={student.payhere_order_id ?? "Not available"} mono />
                  </div>
                </section>
              </div>

              <aside className="space-y-8">
                <section className="rounded-[2rem] border border-neutral-100 bg-neutral-900 p-8 text-white shadow-2xl">
                  <h2 className="text-2xl font-black tracking-tight">
                    Current Row Status
                  </h2>
                  <div className="mt-6 space-y-4">
                    <SidebarLine label="Program" value={student.selected_diploma} />
                    <SidebarLine label="Registration ID" value={student.registration_id} mono />
                    <SidebarLine label="Student ID" value={student.student_id ?? "Pending"} mono />
                    <SidebarLine label="Payment Method" value={formatPaymentMethod(student.payment_method)} />
                    <SidebarLine label="Payment Status" value={student.payment_status.replaceAll("_", " ")} />
                    <SidebarLine label="Amount Paid" value={primaryAmount} />
                  </div>

                  <div className="mt-8 grid gap-3">
                    <a
                      href={`mailto:${student.email}`}
                      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-4 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-200"
                    >
                      Email Student
                    </a>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/20"
                    >
                      Open WhatsApp
                    </a>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                    Payment Artifacts
                  </h2>
                  <div className="mt-6 grid gap-3">
                    <a
                      href={receiptHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800"
                    >
                      Open Receipt
                    </a>
                    <a
                      href={`${receiptHref}?download=true`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-4 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900"
                    >
                      Download Receipt PDF
                    </a>
                    {slipHref ? (
                      <a
                        href={slipHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 px-5 py-4 text-xs font-black uppercase tracking-widest text-indigo-700 transition-all hover:bg-indigo-100"
                      >
                        View Uploaded Slip
                      </a>
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-neutral-200 bg-neutral-50 px-5 py-6 text-center text-sm font-semibold text-neutral-500">
                        No payment slip is attached to this row.
                      </div>
                    )}
                  </div>
                </section>

                {otherRecords.length > 0 ? (
                  <section className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                      Other Rows In Group
                    </h2>
                    <div className="mt-6 space-y-3">
                      {otherRecords.map((record) => (
                        <Link
                          key={record.id}
                          href={`/cca-admin-area/student/${record.id}`}
                          className="block rounded-[1.5rem] border border-neutral-100 bg-neutral-50/50 p-5 transition-all hover:border-neutral-900 hover:bg-white"
                        >
                          <p className="text-base font-black tracking-tight text-neutral-900">
                            {record.selected_diploma}
                          </p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            {record.registration_id}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                ) : null}
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
    <div className="rounded-[1.5rem] border border-neutral-100 bg-neutral-50/50 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black tracking-tight text-neutral-900">
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
      <dd className={`mt-3 text-base font-bold text-neutral-900 ${mono ? "font-mono text-sm" : ""}`}>
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
      <p className={`mt-2 text-sm font-bold text-white ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}
