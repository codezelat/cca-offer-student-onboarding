import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { AdminEditForm } from "@/components/forms/admin-edit-form";
import { requireAdminSession } from "@/lib/auth";
import { adminCopy } from "@/lib/content/admin";
import { bootcamps, districts } from "@/lib/config";
import { prisma } from "@/lib/db";
import { formatBirthDate } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const studentId = Number(id);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="page-frame">
      <div className="page-content">
        <SiteHeader
          admin
          title="Modify Enrollment"
          action={
            <Link
              href="/cca-admin-area/dashboard"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50"
            >
              Cancel Edit
            </Link>
          }
        />
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 sm:p-12 shadow-premium">
            <h1 className="text-4xl font-black tracking-tight text-neutral-900">
              {adminCopy.edit.pageTitle}
            </h1>
            <p className="mt-3 text-base font-semibold text-neutral-500 uppercase tracking-widest leading-relaxed">
              {adminCopy.edit.pageSubtitle}
            </p>
            <div className="mt-12 border-t border-neutral-100 pt-12">
              <AdminEditForm
                student={{
                  id: student.id,
                  full_name: student.full_name,
                  name_with_initials: student.name_with_initials,
                  gender: student.gender as "male" | "female",
                  nic: student.nic,
                  date_of_birth: formatBirthDate(student.date_of_birth),
                  whatsapp_number: student.whatsapp_number,
                  home_contact_number: student.home_contact_number,
                  email: student.email,
                  permanent_address: student.permanent_address,
                  postal_code: student.postal_code ?? "",
                  district: student.district,
                  selected_diploma: student.selected_diploma,
                  registration_id: student.registration_id,
                  payment_method: student.payment_method ?? "",
                  payment_status: student.payment_status,
                  amount_paid: student.amount_paid?.toString() ?? "",
                }}
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
