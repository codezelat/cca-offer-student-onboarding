import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminEditForm } from "@/components/forms/admin-edit-form";
import { requireAdminSession } from "@/lib/auth";
import { bootcamps, districts } from "@/lib/config";
import { prisma } from "@/lib/db";
import { getRegistrationGroupWhere } from "@/lib/registration-groups";
import { formatSimpleDate } from "@/lib/utils";

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

function formatPaymentStatus(paymentMethod: string | null, paymentStatus: string) {
  if (paymentMethod === "slip") {
    return paymentStatus === "completed" ? "Slip Approved" : "Slip Pending";
  }

  return paymentStatus.replaceAll("_", " ");
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
    },
  });

  return (
    <div className="page-frame">
      <div className="page-content">
        <AdminHeader
          title="Edit Record"
          subtitle={student.registration_id}
          action={
            <Link
              href={`/cca-admin-area/student/${student.id}`}
              className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900 hover:bg-neutral-50"
            >
              View Record
            </Link>
          }
        />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-premium sm:p-14">
            <div className="border-b border-neutral-100 pb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                {student.registration_id}
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
                Edit: {student.full_name}
              </h1>
              <p className="mt-3 text-base font-medium text-neutral-500">
                Update student details and the current program row.
              </p>
            </div>

            <div className="mt-8">
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
                  payment_method: formatPaymentMethod(student.payment_method),
                  payment_status: formatPaymentStatus(student.payment_method, student.payment_status),
                  amount_paid: student.amount_paid?.toString() ?? "",
                  payment_date: formatSimpleDate(student.payment_date),
                  payhere_order_id: student.payhere_order_id ?? "",
                  payment_slip: student.payment_slip ?? "",
                  created_at: formatSimpleDate(student.created_at),
                  updated_at: formatSimpleDate(student.updated_at),
                }}
                relatedRecords={relatedRecords.map((record) => ({
                  ...record,
                  payment_status: formatPaymentStatus(record.payment_method, record.payment_status),
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
