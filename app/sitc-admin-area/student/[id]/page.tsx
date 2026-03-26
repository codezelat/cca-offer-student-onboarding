import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminStudentDetailPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
  });

  if (!student) {
    notFound();
  }

  const entries = [
    ["Registration ID", student.registration_id],
    ["Full Name", student.full_name],
    ["Name with Initials", student.name_with_initials],
    ["Selected Diploma", student.selected_diploma],
    ["NIC", student.nic],
    ["WhatsApp", student.whatsapp_number],
    ["Email", student.email],
    ["District", student.district],
    ["Payment Method", student.payment_method ?? "-"],
    ["Payment Status", student.payment_status],
    ["Amount Paid", student.amount_paid?.toString() ?? "-"],
  ];

  return (
    <div className="page-frame">
      <div className="page-content">
        <SiteHeader
          admin
          title="Student Details"
          action={
            <div className="flex items-center gap-3">
              <Link
                href="/sitc-admin-area/dashboard"
                className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-900"
              >
                Back to Dashboard
              </Link>
              <Link
                href={`/sitc-admin-area/student/${student.id}/edit`}
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white"
              >
                Edit
              </Link>
            </div>
          }
        />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Student Details
            </h1>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {entries.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </main>
      </div>
    </div>
  );
}
