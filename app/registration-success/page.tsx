import Link from "next/link";
import { redirect } from "next/navigation";

import { PrintButton } from "@/components/print-button";
import { PublicShell } from "@/components/public-shell";
import { publicCopy } from "@/lib/content/public";
import { prisma } from "@/lib/db";
import { getBootcampWhatsappLink } from "@/lib/student-service";

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

  const whatsappLink = getBootcampWhatsappLink(record.selected_diploma);

  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-10 py-8 px-2">
        <section className="relative overflow-hidden w-full rounded-[2.5rem] border border-emerald-200 bg-emerald-50/50 p-8 sm:p-12">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-200 animate-in zoom-in duration-500">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-emerald-950">
            {publicCopy.genericSuccess.title}
          </h1>
          <p className="mt-4 text-lg font-medium leading-relaxed text-emerald-900">
            {publicCopy.genericSuccess.welcome.replace(
              "{{ $student->name_with_initials ?? $student->full_name }}",
              record.name_with_initials || record.full_name,
            )}
          </p>
          <p className="mt-4 text-base leading-7 text-emerald-800/80">
            {publicCopy.genericSuccess.body.replace(
              "{{ $student->selected_diploma }}",
              record.selected_diploma,
            )}
          </p>
        </section>

        <section className="w-full rounded-[2.5rem] border border-neutral-200 bg-white p-8 sm:p-10">
          <h2 className="text-xl font-bold text-neutral-900">
            {publicCopy.genericSuccess.registrationIdTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {publicCopy.genericSuccess.registrationIdBody}
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 p-6 shadow-inner">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2">
              Official Registration ID
            </div>
            <div className="text-4xl font-black tracking-tighter text-neutral-900 tabular-nums">
              {record.registration_id}
            </div>
          </div>
        </section>

        {whatsappLink ? (
          <section className="w-full rounded-[2.5rem] border border-emerald-200 bg-emerald-50/50 p-8 sm:p-10">
            <h2 className="text-xl font-bold text-emerald-950">
              {publicCopy.genericSuccess.whatsappTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-emerald-900">
              {publicCopy.genericSuccess.whatsappBody}
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex justify-center items-center gap-3 rounded-xl bg-[#25D366] px-10 py-5 text-base font-bold text-white transition-all hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-[#25D366]/20 active:scale-[0.98] w-full sm:w-auto"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {publicCopy.genericSuccess.whatsappCta}
            </a>
          </section>
        ) : null}

        <section className="w-full rounded-[2.5rem] border border-neutral-200 bg-neutral-50 p-8 sm:p-10">
          <h2 className="text-xl font-bold text-neutral-900">
            {publicCopy.genericSuccess.nextStepsTitle}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {publicCopy.genericSuccess.nextSteps.map((step, idx) => (
              <div key={step} className="flex gap-4 rounded-2xl bg-white border border-neutral-100 p-5 shadow-soft">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-[10px] font-bold text-white">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium leading-6 text-neutral-700">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-10 border-t border-neutral-200/60">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-neutral-900 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.98] shadow-lg shadow-neutral-900/10"
            >
              {publicCopy.genericSuccess.buttons.home}
            </Link>
            <PrintButton
              label={publicCopy.genericSuccess.buttons.print}
              className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-neutral-300 bg-white px-10 py-4 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
            />
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
