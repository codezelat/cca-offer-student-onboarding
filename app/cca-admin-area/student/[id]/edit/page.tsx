import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminEditForm } from "@/components/forms/admin-edit-form";
import { SiteHeader } from "@/components/site-header";
import { requireAdminSession } from "@/lib/auth";
import { bootcamps, districts } from "@/lib/config";
import { prisma } from "@/lib/db";
import { getRegistrationGroupWhere } from "@/lib/registration-groups";
import { formatCurrency, formatSimpleDate } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
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

export default async function AdminEditPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
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
    select: {
      id: true,
      registration_id: true,
      selected_diploma: true,
      payment_status: true,
      payment_method: true,
      student_id: true,
    },
  });

  return (
    <div className="page-frame">
      <div className="page-content">
        <SiteHeader
          admin
          title="Edit Enrollment"
          action={
            <div className="flex items-center gap-3">
              <Link
                href={`/cca-admin-area/student/${student.id}`}
                className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50"
              >
                View Record
              </Link>
              <Link
                href="/cca-admin-area/dashboard"
                className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50"
              >
                Dashboard
              </Link>
            </div>
          }
        />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-premium sm:p-14">
            <div className="flex flex-col gap-8 border-b border-neutral-100 pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                  Admin CRUD
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
                  Edit Enrollment Record
                </h1>
                <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-neutral-500">
                  Shared identity and contact fields update across the full registration group. The selected bootcamp only changes for the current row.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard label="Current Row" value={student.selected_diploma} />
                <MetricCard label="Group Rows" value={`${relatedRecords.length}`} />
                <MetricCard
                  label="Current Paid"
                  value={student.amount_paid ? formatCurrency(student.amount_paid.toString()) : formatCurrency(0)}
                />
              </div>
            </div>

            <div className="mt-10">
              <AdminEditForm
                student={{
                  id: student.id,
                  full_name: student.full_name,
                  name_with_initials: student.name_with_initials,
                  gender: student.gender as "male" | "female",
                  nic: student.nic,
                  date_of_birth: new Intl.DateTimeFormat("en-CA", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                    .format(student.date_of_birth)
                    .replaceAll("/", "-"),
                  whatsapp_number: student.whatsapp_number,
                  home_contact_number: student.home_contact_number,
                  email: student.email,
                  permanent_address: student.permanent_address,
                  postal_code: student.postal_code ?? "",
                  district: student.district,
                  selected_diploma: student.selected_diploma,
                  registration_id: student.registration_id,
                  student_id: student.student_id ?? "",
                  payment_method: formatPaymentMethod(student.payment_method),
                  payment_status: student.payment_status.replaceAll("_", " "),
                  amount_paid: student.amount_paid?.toString() ?? "",
                  payment_date: formatSimpleDate(student.payment_date),
                  payhere_order_id: student.payhere_order_id ?? "",
                  payment_slip: student.payment_slip ?? "",
                  created_at: formatSimpleDate(student.created_at),
                  updated_at: formatSimpleDate(student.updated_at),
                }}
                relatedRecords={relatedRecords.map((record) => ({
                  ...record,
                  payment_status: record.payment_status.replaceAll("_", " "),
                  payment_method: formatPaymentMethod(record.payment_method),
                }))}
                districts={districts}
                diplomas={bootcamps}
              />
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
      <p className="mt-3 text-base font-black tracking-tight text-neutral-900">
        {value}
      </p>
    </div>
  );
}
