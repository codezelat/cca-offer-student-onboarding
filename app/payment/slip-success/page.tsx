import Link from "next/link";
import { redirect } from "next/navigation";

import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { publicCopy } from "@/lib/content/public";
import { prisma } from "@/lib/db";

type Props = {
  searchParams: Promise<{ student?: string }>;
};

export default async function SlipSuccessPage({ searchParams }: Props) {
  const { student } = await searchParams;
  const studentId = Number(student);
  if (!studentId) {
    redirect("/");
  }

  const record = await prisma.student.findUnique({ where: { id: studentId } });
  if (!record) {
    redirect("/");
  }

  // Fetch all registered bootcamps for this student in this session
  const baseRegId = record.registration_id.split("-")[0];
  const allRecords = await prisma.student.findMany({
    where: {
      OR: [
        { registration_id: baseRegId },
        { registration_id: { startsWith: `${baseRegId}-` } },
      ],
    },
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

          <section className="w-full rounded-[2rem] border border-emerald-200 bg-emerald-50/50 p-8 sm:p-12 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white mb-6 no-print">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
              {publicCopy.slipSuccess.title}
            </h1>
            <p className="mt-4 text-lg font-medium leading-relaxed text-emerald-900/80">
              {publicCopy.slipSuccess.subtitle}
            </p>
          </section>

          <section className="w-full rounded-[2rem] border border-neutral-200 bg-white p-8 sm:p-12 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              {publicCopy.slipSuccess.reviewTitle}
            </h2>
            <ul className="mt-8 space-y-4">
              {publicCopy.slipSuccess.reviewBullets.map((item) => (
                <li key={item} className="flex gap-4 text-sm leading-6 text-neutral-600">
                  <span className="flex-none text-emerald-500 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="w-full rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8 sm:p-12 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              {publicCopy.slipSuccess.importantTitle}
            </h2>
            <div className="mt-8 space-y-8">
              <div className="rounded-2xl bg-neutral-900 p-6 text-white shadow-xl shadow-neutral-900/10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-2">
                  Assigned Registration ID(s)
                </span>
                <span className="text-xl font-black tracking-tighter">
                  {regIds.join(", ")}
                </span>
              </div>

              <ul className="space-y-4">
                {publicCopy.slipSuccess.importantBullets
                  .filter(item => !item.includes("{{ $student->registration_id }}"))
                  .map((item) => (
                    <li key={item} className="flex gap-4 text-sm leading-6 text-neutral-600">
                      <span className="flex-none text-neutral-400">•</span>
                      {item}
                    </li>
                  ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 no-print pt-6 border-t border-neutral-200">
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-neutral-900 px-10 py-4 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
                >
                  {publicCopy.slipSuccess.buttons.home}
                </Link>
                <Link
                  href={`/payment/receipt/${record.id}?download=true`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-neutral-300 bg-white px-10 py-4 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                >
                  {publicCopy.slipSuccess.buttons.print}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      </PublicShell>
  );
}
