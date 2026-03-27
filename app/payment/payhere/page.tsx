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

        <div className="w-full max-w-2xl space-y-10">
          
          <section className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              {publicCopy.payhere.title}
            </h1>
            <p className="mt-4 text-lg font-semibold text-emerald-600 bg-emerald-50 inline-block px-6 py-2 rounded-full border border-emerald-100 italic">
              Total Payable: Rs. {Number(payment.amount).toLocaleString()} <span className="ml-2 text-emerald-500/70 text-sm font-medium">({data.selected_bootcamps.length} programs)</span>
            </p>
          </section>

          <section className="rounded-3xl border border-neutral-100 bg-white p-8 shadow-premium">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Detail label={publicCopy.payhere.labels.registrationId} value={data.registration_id} />
              <Detail label={publicCopy.payhere.labels.studentName} value={data.full_name} />
              <Detail label={publicCopy.payhere.labels.selectedDiploma} value={data.selected_bootcamps.join(" & ")} />
              <Detail label={publicCopy.payhere.labels.totalAmount} value={`Rs. ${Number(payment.amount).toLocaleString()}`} />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-4">
              <PayHereLauncher payment={payment} />
              <a
                href="/payment/options"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                {publicCopy.payhere.back}
              </a>
            </div>

            <div className="rounded-3xl border border-neutral-100 bg-neutral-50/50 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {publicCopy.payhere.securityTitle}
                </h3>
              </div>
              <ul className="mt-6 space-y-4">
                {publicCopy.payhere.securityLines.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-6 text-neutral-600">
                    <svg className="h-5 w-5 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {line}
                  </li>
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
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 transition-all hover:border-neutral-200">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-neutral-900 break-all">{value}</dd>
    </div>
  );
}
