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
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-12 py-8 px-2">
        <div className="w-full">
          <ProgressStepper
            title={publicCopy.register.progressTitle}
            step={publicCopy.slipSuccess.step}
            labels={publicCopy.slipSuccess.statusSteps}
            current={3}
          />
        </div>
        
        <div className="w-full flex flex-col space-y-10">
          <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 sm:p-10">
            <h1 className="text-3xl font-medium tracking-tight text-amber-950">
              {publicCopy.slipSuccess.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-amber-900">
              {publicCopy.slipSuccess.subtitle}
            </p>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
            <h2 className="text-xl font-medium text-neutral-900">
              {publicCopy.slipSuccess.reviewTitle}
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-sm leading-6 text-neutral-600">
              {publicCopy.slipSuccess.reviewBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] bg-neutral-50 p-6 sm:p-10 border border-neutral-200">
            <h2 className="text-xl font-medium text-neutral-900">
              {publicCopy.slipSuccess.importantTitle}
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-sm leading-6 text-neutral-700">
              {publicCopy.slipSuccess.importantBullets.map((item) => (
                <li key={item}>
                  {item.replace("{{ $student->registration_id }}", record.registration_id)}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                {publicCopy.slipSuccess.buttons.home}
              </Link>
              <PrintButton
                label={publicCopy.slipSuccess.buttons.print}
                className="w-full sm:w-auto inline-flex justify-center rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
              />
            </div>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
