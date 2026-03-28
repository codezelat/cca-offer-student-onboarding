import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { publicCopy } from "@/lib/content/public";
import { prisma } from "@/lib/db";
import { hasReceiptAccess } from "@/lib/receipt-access";
import { getRegistrationGroupWhere } from "@/lib/registration-groups";
import { getSession } from "@/lib/session";

type Props = {
  searchParams: Promise<{ student?: string; token?: string }>;
};

export default async function SlipSuccessPage({ searchParams }: Props) {
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

  // Fetch all registered bootcamps for this student in this session
  const allRecords = await prisma.student.findMany({
    where: getRegistrationGroupWhere(record.registration_id),
    orderBy: { registration_id: "asc" },
  });

  const regIds = allRecords.map((r) => r.registration_id);

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8">
          <div className="w-full">
            <ProgressStepper
              title={publicCopy.register.progressTitle}
              step={publicCopy.slipSuccess.step}
              labels={publicCopy.slipSuccess.statusSteps}
              current={3}
            />
          </div>
          
          <div className="hidden print:block border-b-2 border-neutral-900 pb-6 mb-8">
            <h1 className="text-2xl font-black uppercase tracking-widest text-neutral-900">Official Registration Receipt</h1>
            <p className="text-sm font-bold text-neutral-500 mt-1 uppercase tracking-wider">CCA Education Programs — Powered by Codezela</p>
          </div>

          <section className="w-full rounded-[2.5rem] border border-emerald-100 bg-emerald-50/50 p-10 sm:p-14 shadow-premium">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-emerald-500 text-white mb-8 no-print shadow-xl shadow-emerald-500/20">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-emerald-950 uppercase italic">
              {publicCopy.slipSuccess.title}
            </h1>
            <p className="mt-6 text-lg font-medium leading-relaxed text-emerald-900/80">
              {publicCopy.slipSuccess.subtitle}
            </p>
          </section>

          <section className="w-full rounded-[2.5rem] border border-neutral-100 bg-white p-10 sm:p-14 shadow-premium">
            <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase italic">
              {publicCopy.slipSuccess.reviewTitle}
            </h2>
            <ul className="mt-10 space-y-6">
              {publicCopy.slipSuccess.reviewBullets.map((item) => (
                <li key={item} className="flex gap-4 text-sm font-medium leading-relaxed text-neutral-600">
                  <span className="flex-none flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-black">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="w-full rounded-[2.5rem] border border-neutral-100 bg-neutral-900 p-10 sm:p-14 shadow-2xl">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
              {publicCopy.slipSuccess.importantTitle}
            </h2>
            <div className="mt-10 space-y-10">
              <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-8 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 block mb-4">
                  Assigned Registration ID(s)
                </span>
                <span className="text-3xl font-black tracking-tighter text-white font-mono bg-white/10 px-4 py-2 rounded-2xl">
                  {regIds.join(", ")}
                </span>
              </div>

              <ul className="space-y-4">
                {publicCopy.slipSuccess.importantBullets
                  .filter(item => !item.includes("{{ $student->registration_id }}"))
                  .map((item) => (
                    <li key={item} className="flex gap-4 text-sm font-medium leading-relaxed text-neutral-400">
                      <span className="flex-none text-neutral-600">•</span>
                      {item}
                    </li>
                  ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 no-print pt-10 border-t border-white/10">
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex justify-center rounded-full bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-200 active:scale-[0.98]"
                >
                  {publicCopy.slipSuccess.buttons.home}
                </Link>
                <Link
                  href={`/payment/receipt/${record.id}?download=true&token=${encodeURIComponent(token ?? "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex justify-center rounded-full border-2 border-white/20 bg-transparent px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-[0.98]"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {publicCopy.slipSuccess.buttons.print.replace("Print", "Download")}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      </PublicShell>
  );
}
