import Link from "next/link";
import { redirect } from "next/navigation";

import { PrintButton } from "@/components/print-button";
import { PublicShell } from "@/components/public-shell";
import { publicCopy } from "@/lib/content/public";
import { prisma } from "@/lib/db";
import { getDiplomaWhatsappLink } from "@/lib/student-service";

type Props = {
  searchParams: Promise<{ student?: string }>;
};

export default async function RegistrationSuccessPage({ searchParams }: Props) {
  const { student } = await searchParams;
  const studentId = Number(student);
  if (!studentId) {
    redirect("/");
  }

  const record = await prisma.student.findUnique({ where: { id: studentId } });
  if (!record) {
    redirect("/");
  }

  const whatsappLink = getDiplomaWhatsappLink(record.selected_diploma);

  return (
    <PublicShell>
      <div className="grid gap-6">
        <section className="rounded-[2.5rem] border border-emerald-200 bg-emerald-50 p-8 shadow-soft">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            {publicCopy.genericSuccess.title}
          </h1>
          <p className="mt-4 text-xl leading-8 text-slate-800">
            {publicCopy.genericSuccess.welcome.replace(
              "{{ $student->name_with_initials ?? $student->full_name }}",
              record.name_with_initials || record.full_name,
            )}
          </p>
          <p className="mt-2 text-base leading-7 text-slate-700">
            {publicCopy.genericSuccess.body.replace(
              "{{ $student->selected_diploma }}",
              record.selected_diploma,
            )}
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
            <h2 className="text-xl font-semibold text-slate-950">
              {publicCopy.genericSuccess.registrationIdTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {publicCopy.genericSuccess.registrationIdBody}
            </p>
            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-2xl font-semibold tracking-tight text-slate-950">
              {record.registration_id}
            </div>
          </section>

          {whatsappLink ? (
            <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 shadow-card">
              <h2 className="text-xl font-semibold text-emerald-950">
                {publicCopy.genericSuccess.whatsappTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-emerald-900">
                {publicCopy.genericSuccess.whatsappBody}
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
              >
                {publicCopy.genericSuccess.whatsappCta}
              </a>
            </section>
          ) : null}
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
          <h2 className="text-xl font-semibold text-slate-950">
            {publicCopy.genericSuccess.nextStepsTitle}
          </h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-sm leading-6 text-slate-700">
            {publicCopy.genericSuccess.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              {publicCopy.genericSuccess.buttons.home}
            </Link>
            <PrintButton
              label={publicCopy.genericSuccess.buttons.print}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            />
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
