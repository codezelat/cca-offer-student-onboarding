import Link from "next/link";
import { redirect } from "next/navigation";

import { PrintButton } from "@/components/print-button";
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

  return (
    <PublicShell>
      <div className="grid gap-6">
        <ProgressStepper
          title={publicCopy.register.progressTitle}
          step={publicCopy.slipSuccess.step}
          labels={publicCopy.slipSuccess.statusSteps}
          current={3}
        />
        <section className="rounded-[2.5rem] border border-amber-200 bg-amber-50 p-8 shadow-soft">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            {publicCopy.slipSuccess.title}
          </h1>
          <p className="mt-4 text-xl leading-8 text-slate-800">
            {publicCopy.slipSuccess.subtitle}
          </p>
        </section>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
            <h2 className="text-xl font-semibold text-slate-950">
              {publicCopy.slipSuccess.reviewTitle}
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-sm leading-6 text-slate-700">
              {publicCopy.slipSuccess.reviewBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
            <h2 className="text-xl font-semibold text-slate-950">
              {publicCopy.slipSuccess.importantTitle}
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-sm leading-6 text-slate-700">
              {publicCopy.slipSuccess.importantBullets.map((item) => (
                <li key={item}>
                  {item.replace("{{ $student->registration_id }}", record.registration_id)}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                {publicCopy.slipSuccess.buttons.home}
              </Link>
              <PrintButton
                label={publicCopy.slipSuccess.buttons.print}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              />
            </div>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
