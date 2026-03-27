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
    ["Program", data.selected_bootcamps.join(" & ")],
    ["WhatsApp Number", data.whatsapp_number],
    ["Emergency Contact", data.home_contact_number],
    ["District", data.district],
    ["Postal Code", data.postal_code || "-"],
    ["Permanent Address", data.permanent_address],
    ["Registration Fee", `Rs. ${(3000 * data.selected_bootcamps.length).toLocaleString()}`],
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
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {summary.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 transition-all hover:border-neutral-200"
                >
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-neutral-900 line-clamp-2">
                    {value}
                  </dd>
                </div>
              ))}
            </div>
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

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <section className="group relative rounded-[2rem] border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-900 hover:shadow-xl">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-soft">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  {publicCopy.paymentOptions.onlineTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  {publicCopy.paymentOptions.onlineBody}
                </p>
                <form action="/api/payment/payhere/start" method="post" className="mt-8">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-xl bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    {publicCopy.paymentOptions.onlineCta}
                  </button>
                </form>
              </section>

              <section className="group relative rounded-[2rem] border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-900 hover:shadow-xl">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 shadow-soft">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  {publicCopy.paymentOptions.slipTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  {publicCopy.paymentOptions.slipBody}
                </p>
                <Link
                  href="/payment/upload-slip"
                  className="mt-8 inline-flex w-full justify-center rounded-xl border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                >
                  {publicCopy.paymentOptions.slipCta}
                </Link>
              </section>
            </div>

            <div className="mt-10 pt-10 border-t border-neutral-100">
              <Link
                href={`/register?bootcamp=${encodeURIComponent(data.selected_bootcamps.join(","))}`}
                className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50"
              >
                {publicCopy.paymentOptions.back}
              </Link>
            </div>
          </section>

        </div>
      </div>
    </PublicShell>
  );
}
