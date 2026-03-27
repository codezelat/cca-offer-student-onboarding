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
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-12 py-8 px-2">
        
        <div className="w-full space-y-8">
          <CountdownCard
            deadline={getDeadline()}
            title={publicCopy.countdown.paymentTitle}
            subtitle={publicCopy.countdown.paymentSubtitle}
          />
          <ProgressStepper
            title={publicCopy.paymentOptions.progressTitle}
            step={publicCopy.paymentOptions.step}
            labels={publicCopy.register.steps}
            current={2}
          />
        </div>

        <div className="w-full flex flex-col space-y-10">
          
          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
            <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
              {publicCopy.paymentOptions.registrationDetails}
            </h1>
            <dl className="mt-8 space-y-4">
              {summary.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row sm:justify-between border-b border-neutral-100 pb-4 last:border-none last:pb-0"
                >
                  <dt className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1 sm:mb-0">
                    {label}
                  </dt>
                  <dd className="text-sm text-neutral-900 text-left sm:text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-[2rem] bg-neutral-50 p-6 sm:p-10 border border-neutral-200">
            <h2 className="text-2xl font-medium tracking-tight text-neutral-900">
              {publicCopy.paymentOptions.blockTitle}
            </h2>
            <ol className="mt-8 space-y-4">
              {publicCopy.paymentOptions.bullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="flex items-start gap-4 rounded-3xl border border-neutral-200 bg-white p-5 text-sm leading-7 text-neutral-800"
                >
                  <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{bullet}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-[1.5rem] border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-medium text-neutral-900">
                {publicCopy.paymentOptions.agreementTitle}
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    {publicCopy.paymentOptions.agreementLabels[0]}
                  </div>
                  <div className="mt-2 text-sm font-medium text-neutral-900">
                    {data.full_name}
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    {publicCopy.paymentOptions.agreementLabels[1]}
                  </div>
                  <div className="mt-2 text-sm font-medium text-neutral-900">
                    {data.nic}
                  </div>
                </div>
              </div>
            </div>

            <form action="/api/payment/agree" method="post" className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                {publicCopy.paymentOptions.cta}
              </button>
              <Link
                href={`/register?diploma=${encodeURIComponent(data.selected_diploma)}`}
                className="w-full sm:w-auto inline-flex justify-center rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
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
