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
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-10 py-8 px-2">
        <section className="w-full rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 sm:p-10">
          <h1 className="text-3xl font-medium tracking-tight text-emerald-950">
            {publicCopy.genericSuccess.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-emerald-900">
            {publicCopy.genericSuccess.welcome.replace(
              "{{ $student->name_with_initials ?? $student->full_name }}",
              record.name_with_initials || record.full_name,
            )}
          </p>
          <p className="mt-2 text-base leading-7 text-emerald-800">
            {publicCopy.genericSuccess.body.replace(
              "{{ $student->selected_diploma }}",
              record.selected_diploma,
            )}
          </p>
        </section>

        <section className="w-full rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
          <h2 className="text-xl font-medium text-neutral-900">
            {publicCopy.genericSuccess.registrationIdTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {publicCopy.genericSuccess.registrationIdBody}
          </p>
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-2xl font-bold tracking-tight text-neutral-900">
            {record.registration_id}
          </div>
        </section>

        {whatsappLink ? (
          <section className="w-full rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 sm:p-10">
            <h2 className="text-xl font-medium text-emerald-950">
              {publicCopy.genericSuccess.whatsappTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-emerald-900">
              {publicCopy.genericSuccess.whatsappBody}
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex justify-center rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a] w-full sm:w-auto"
            >
              {publicCopy.genericSuccess.whatsappCta}
            </a>
          </section>
        ) : null}

        <section className="w-full rounded-[2rem] bg-neutral-50 border border-neutral-200 p-6 sm:p-10">
          <h2 className="text-xl font-medium text-neutral-900">
            {publicCopy.genericSuccess.nextStepsTitle}
          </h2>
          <ul className="mt-6 list-disc space-y-3 pl-6 text-sm leading-6 text-neutral-700">
            {publicCopy.genericSuccess.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              {publicCopy.genericSuccess.buttons.home}
            </Link>
            <PrintButton
              label={publicCopy.genericSuccess.buttons.print}
              className="w-full sm:w-auto inline-flex justify-center rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
            />
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
