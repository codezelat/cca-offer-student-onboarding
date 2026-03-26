import Link from "next/link";

import { CountdownCard } from "@/components/countdown-card";
import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { getDeadline } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { getRegistrationSessionOrRedirect } from "@/lib/flow";
import { formatBirthDate } from "@/lib/utils";

export default async function PaymentOptionsPage() {
  const data = await getRegistrationSessionOrRedirect();

  const summary = [
    ["Registration ID", data.registration_id],
    ["Full Name", data.full_name],
    ["Name with Initials", data.name_with_initials],
    ["Gender", data.gender],
    ["NIC", data.nic],
    ["Date of Birth", formatBirthDate(data.date_of_birth)],
    ["Email", data.email],
    ["Program", data.selected_diploma],
    ["WhatsApp Number", data.whatsapp_number],
    ["Emergency Contact", data.home_contact_number],
    ["District", data.district],
    ["Postal Code", data.postal_code || "-"],
    ["Permanent Address", data.permanent_address],
    ["Course Duration", publicCopy.paymentOptions.courseDuration],
  ];

  return (
    <PublicShell wide>
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
          <ProgressStepper
            title={publicCopy.paymentOptions.progressTitle}
            step={publicCopy.paymentOptions.step}
            labels={publicCopy.register.steps}
            current={2}
          />
          <CountdownCard
            deadline={getDeadline()}
            title={publicCopy.countdown.paymentTitle}
            subtitle={publicCopy.countdown.paymentSubtitle}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="shadow-card rounded-[2rem] border border-slate-200 bg-white p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {publicCopy.paymentOptions.registrationDetails}
            </h1>
            <dl className="mt-6 space-y-4">
              {summary.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 border-b border-slate-100 pb-4 last:border-none last:pb-0"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {label}
                  </dt>
                  <dd className="text-sm leading-6 text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="shadow-soft rounded-[2rem] border border-rose-100 bg-gradient-accent p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              {publicCopy.paymentOptions.blockTitle}
            </h2>
            <ol className="mt-6 space-y-4">
              {publicCopy.paymentOptions.bullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 text-sm leading-7 text-slate-800 shadow-card"
                >
                  <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  {bullet}
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white/80 p-5">
              <h3 className="text-lg font-semibold text-slate-950">
                {publicCopy.paymentOptions.agreementTitle}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {publicCopy.paymentOptions.agreementLabels[0]}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {data.full_name}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {publicCopy.paymentOptions.agreementLabels[1]}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {data.nic}
                  </div>
                </div>
              </div>
            </div>

            <form action="/api/payment/agree" method="post" className="mt-6 flex flex-wrap gap-4">
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                {publicCopy.paymentOptions.cta}
              </button>
              <Link
                href={`/register?diploma=${encodeURIComponent(data.selected_diploma)}`}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                {publicCopy.paymentOptions.back}
              </Link>
            </form>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
