import { redirect } from "next/navigation";

import { CountdownCard } from "@/components/countdown-card";
import { PayHereLauncher } from "@/components/payhere-launcher";
import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { getDeadline } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { getSession } from "@/lib/session";

export default async function PayHerePage() {
  const session = await getSession();
  const payment = session.payhere_payment;
  const data = session.registration_data;

  if (!payment || !data) {
    redirect("/payment/options");
  }

  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-12 py-8 px-2">
        
        <div className="w-full space-y-8">
          <CountdownCard deadline={getDeadline()} title={publicCopy.countdown.title} />
          <ProgressStepper
            title={publicCopy.register.progressTitle}
            step={publicCopy.payhere.step}
            labels={["Details", "Payment", "Card Payment"]}
            current={3}
          />
        </div>

        <div className="w-full flex flex-col space-y-10">
          
          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
            <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
              {publicCopy.payhere.title}
            </h1>
            <p className="mt-2 text-base leading-7 text-neutral-600">
              {publicCopy.payhere.subtitle}
            </p>
            <div className="mt-8 space-y-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
              <Detail label={publicCopy.payhere.labels.registrationId} value={data.registration_id} />
              <Detail label={publicCopy.payhere.labels.studentName} value={data.full_name} />
              <Detail label={publicCopy.payhere.labels.selectedDiploma} value={data.selected_bootcamps.join(" & ")} />
              <Detail label={publicCopy.payhere.labels.totalAmount} value={`Rs. ${Number(payment.amount).toLocaleString()}`} />
            </div>
          </section>

          <section className="rounded-[2rem] bg-neutral-50 p-6 sm:p-10 border border-neutral-200">
            <h2 className="text-2xl font-medium tracking-tight text-neutral-900">
              {publicCopy.payhere.ctaTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-neutral-600">
              {publicCopy.payhere.ctaBody}
            </p>
            <div className="mt-8">
              <PayHereLauncher payment={payment} />
            </div>
            <a
              href="/payment/options"
              className="mt-6 inline-flex justify-center rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 flex-col sm:flex-row w-full sm:w-auto"
            >
              {publicCopy.payhere.back}
            </a>

            <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-medium text-neutral-900">
                {publicCopy.payhere.securityTitle}
              </h3>
              <ul className="mt-4 list-disc space-y-3 pl-6 text-sm leading-6 text-neutral-600">
                {publicCopy.payhere.securityLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </section>

        </div>
      </div>
    </PublicShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-neutral-200 pb-3 last:border-none last:pb-0">
      <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1 sm:mb-0">
        {label}
      </div>
      <div className="text-sm font-medium text-neutral-900 text-left sm:text-right">{value}</div>
    </div>
  );
}
