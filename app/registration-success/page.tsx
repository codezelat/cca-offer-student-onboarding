import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PublicShell } from "@/components/public-shell";
import { publicCopy } from "@/lib/content/public";
import { prisma } from "@/lib/db";
import { hasReceiptAccess } from "@/lib/receipt-access";
import { getRegistrationGroupWhere } from "@/lib/registration-groups";
import { getSession } from "@/lib/session";
import { getBootcampWhatsappLink } from "@/lib/student-service";

type Props = {
  searchParams: Promise<{ student?: string; token?: string }>;
};

export default async function RegistrationSuccessPage({ searchParams }: Props) {
  const { student, token } = await searchParams;
  const studentId = Number(student);
  if (!studentId) {
    redirect("/");
  }

  const record = await prisma.student.findUnique({ where: { id: studentId } });
  if (!record) {
    redirect("/");
  }

  const session = await getSession();
  const allowed = await hasReceiptAccess({
    registrationId: record.registration_id,
    token,
    adminLoggedIn: session.admin_logged_in,
  });

  if (!allowed) {
    return notFound();
  }

  const allRecords = await prisma.student.findMany({
    where: getRegistrationGroupWhere(record.registration_id),
    orderBy: { registration_id: "asc" },
  });

  const bootcampNames = allRecords.map((entry) => entry.selected_diploma);
  const registrationIds = allRecords.map((entry) => entry.registration_id);
  const whatsappGroups = Array.from(
    new Map(
      allRecords
        .map((entry) => {
          const link = getBootcampWhatsappLink(entry.selected_diploma);
          return link ? [entry.selected_diploma, link] : null;
        })
        .filter((entry): entry is [string, string] => entry !== null),
    ).entries(),
  ).map(([bootcamp, link]) => ({ bootcamp, link }));

  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-10 py-8 px-2">
        <section className="relative overflow-hidden w-full rounded-[2.5rem] border border-emerald-100 bg-emerald-50/50 p-10 sm:p-14 shadow-premium">
          <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20 animate-in zoom-in duration-700">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-emerald-950 uppercase italic">
            {publicCopy.genericSuccess.title}
          </h1>
          <p className="mt-6 text-xl font-bold leading-relaxed text-emerald-900">
            {publicCopy.genericSuccess.welcome.replace(
              "{{ $student->name_with_initials ?? $student->full_name }}",
              record.name_with_initials || record.full_name,
            )}
          </p>
          <p className="mt-4 text-lg font-medium leading-relaxed text-emerald-800/70">
            {publicCopy.genericSuccess.body.replace(
              "{{ $student->selected_diploma }}",
              bootcampNames.join(" & "),
            )}
          </p>
        </section>

        <section className="w-full rounded-[2.5rem] border border-neutral-100 bg-white p-10 sm:p-14 shadow-premium">
          <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase italic">
            {publicCopy.genericSuccess.registrationIdTitle}
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-neutral-500">
            {publicCopy.genericSuccess.registrationIdBody}
          </p>
          <div className="mt-10 overflow-hidden rounded-[2rem] border-2 border-neutral-100 bg-neutral-50 p-8 shadow-inner group">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4 px-2">
              Official Registration ID{registrationIds.length > 1 ? "s" : ""}
            </div>
            <div className="flex flex-wrap gap-3">
              {registrationIds.map((registrationId) => (
                <div
                  key={registrationId}
                  className="text-3xl font-black tracking-tighter text-neutral-900 tabular-nums bg-white inline-block px-6 py-4 rounded-3xl shadow-sm border border-neutral-100 group-hover:border-neutral-900 transition-colors"
                >
                  {registrationId}
                </div>
              ))}
            </div>
          </div>
        </section>

        {whatsappGroups.length > 0 ? (
          <section className="w-full rounded-[2.5rem] border border-emerald-100 bg-emerald-50/50 p-10 sm:p-14 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight text-emerald-950 uppercase">
              {publicCopy.genericSuccess.whatsappTitle}
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-emerald-900/80">
              {whatsappGroups.length === 1
                ? publicCopy.genericSuccess.whatsappBody
                : "Join each WhatsApp group for the program(s) you registered for."}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {whatsappGroups.map(({ bootcamp, link }) => (
                <a
                  key={bootcamp}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex justify-center items-center gap-4 rounded-full bg-[#25D366] px-8 py-6 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#20bd5a] hover:shadow-2xl hover:shadow-[#25D366]/30 active:scale-[0.98] w-full"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {whatsappGroups.length === 1
                    ? publicCopy.genericSuccess.whatsappCta
                    : `Join ${bootcamp} WhatsApp Group`}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section className="w-full rounded-[2.5rem] border border-neutral-100 bg-neutral-900 p-10 sm:p-14 shadow-2xl">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
            {publicCopy.genericSuccess.nextStepsTitle}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {publicCopy.genericSuccess.nextSteps.map((step, idx) => (
              <div key={step} className="flex gap-4 rounded-3xl bg-white/5 border border-white/10 p-6 shadow-sm group hover:bg-white transition-all">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white text-xs font-black text-neutral-900 shadow-lg group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium leading-relaxed text-neutral-400 group-hover:text-neutral-900 transition-colors">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/10">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex justify-center rounded-full bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-xl shadow-white/5"
            >
              {publicCopy.genericSuccess.buttons.home}
            </Link>
            <a
              href={`/payment/receipt/${record.id}?download=true&token=${encodeURIComponent(token ?? "")}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex justify-center rounded-full border-2 border-white/20 bg-transparent px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {publicCopy.genericSuccess.buttons.print.replace("Print", "Download")}
            </a>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
