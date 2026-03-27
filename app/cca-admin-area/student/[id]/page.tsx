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
    ["Payment Method", student.payment_method ?? "Not Selected"],
    ["Payment Status", student.payment_status],
    ["Amount Paid", student.amount_paid ? `Rs. ${Number(student.amount_paid).toLocaleString()}` : "Rs. 0.00"],
  ];

  return (
    <div className="page-frame">
      <div className="page-content">
        <SiteHeader
          admin
          title="Student Record"
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
                Edit Details
              </Link>
            </div>
          }
        />
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white p-8 sm:p-12 shadow-premium">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-neutral-900">
                  {student.name_with_initials || student.full_name}
                </h1>
                <p className="mt-2 text-base font-semibold text-neutral-500 uppercase tracking-widest">
                  Official Student Enrollment Profile
                </p>
              </div>
              <div className={`mt-6 sm:mt-0 rounded-2xl px-6 py-3 text-sm font-black uppercase tracking-widest ${
                student.payment_status === 'completed' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                {student.payment_status}
              </div>
            </div>

            <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map(([label, value]) => (
                <div
                  key={label}
                  className="group rounded-3xl border border-neutral-100 bg-neutral-50/50 p-6 transition-all hover:border-neutral-900/20 hover:bg-white hover:shadow-lg"
                >
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    {label}
                  </dt>
                  <dd className="mt-3 text-base font-bold text-neutral-900 tracking-tight">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </main>
      </div>
    </div>
  );
}
