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
    <PublicShell wide>
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
          <ProgressStepper
            title={publicCopy.register.progressTitle}
            step={publicCopy.payhere.step}
            labels={["Details", "Payment", "Card Payment"]}
            current={3}
          />
          <CountdownCard deadline={getDeadline()} title={publicCopy.countdown.title} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {publicCopy.payhere.title}
            </h1>
            <p className="mt-2 text-base leading-7 text-slate-600">
              {publicCopy.payhere.subtitle}
            </p>
            <div className="mt-6 space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <Detail label={publicCopy.payhere.labels.registrationId} value={data.registration_id} />
              <Detail label={publicCopy.payhere.labels.studentName} value={data.full_name} />
              <Detail label={publicCopy.payhere.labels.selectedDiploma} value={data.selected_diploma} />
              <Detail label={publicCopy.payhere.labels.totalAmount} value={publicCopy.payhere.labels.amount} />
            </div>
          </section>
          <section className="rounded-[2rem] border border-rose-100 bg-gradient-accent p-8 shadow-soft">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              {publicCopy.payhere.ctaTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">
              {publicCopy.payhere.ctaBody}
            </p>
            <div className="mt-6">
              <PayHereLauncher payment={payment} />
            </div>
            <a
              href="/payment/options"
              className="mt-4 inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            >
              {publicCopy.payhere.back}
            </a>

            <div className="mt-8 rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-card">
              <h3 className="text-xl font-semibold text-slate-950">
                {publicCopy.payhere.securityTitle}
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-6 text-slate-700">
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
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
