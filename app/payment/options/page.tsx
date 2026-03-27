import Link from "next/link";

import { CountdownCard } from "@/components/countdown-card";
import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { getDeadline } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { getRegistrationSessionOrRedirect } from "@/lib/flow";
import { cn } from "@/lib/utils";
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

        <div className="w-full flex flex-col space-y-12">
          
          <section className="rounded-[2.5rem] border border-neutral-100 bg-white p-8 sm:p-12 shadow-premium">
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 uppercase">
              {publicCopy.paymentOptions.registrationDetails}
            </h1>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {summary.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-neutral-50 bg-neutral-50/50 p-5 transition-all hover:bg-white hover:border-neutral-200"
                >
                  <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    {label}
                  </dt>
                  <dd className={cn(
                    "mt-2 text-sm font-bold text-neutral-900 break-words",
                    label === "Registration ID" ? "font-mono tracking-tighter text-lg" : ""
                  )}>
                    {value}
                  </dd>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2.5rem] bg-neutral-900 p-8 sm:p-12 border border-neutral-800 text-white shadow-2xl">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
              {publicCopy.paymentOptions.blockTitle}
            </h2>
            <ol className="mt-10 space-y-4">
              {publicCopy.paymentOptions.bullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="flex items-start gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-base leading-relaxed text-neutral-300"
                >
                  <span className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-neutral-900 shadow-lg">
                    {index + 1}
                  </span>
                  <span className="pt-1 font-medium">{bullet}</span>
                </li>
              ))}
            </ol>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <section className="group relative rounded-[2.5rem] border-2 border-white/10 bg-white p-8 transition-all hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
                  {publicCopy.paymentOptions.onlineTitle}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-neutral-500">
                  {publicCopy.paymentOptions.onlineBody}
                </p>
                <form action="/api/payment/payhere/start" method="post" className="mt-10">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-full bg-neutral-900 px-8 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    {publicCopy.paymentOptions.onlineCta}
                  </button>
                </form>
              </section>

              <section className="group relative rounded-[2.5rem] border-2 border-white/10 bg-white p-8 transition-all hover:border-neutral-900 hover:shadow-2xl hover:shadow-neutral-900/10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-neutral-100 text-neutral-900 shadow-sm group-hover:bg-neutral-900 group-hover:text-white transition-all group-hover:scale-110">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
                  {publicCopy.paymentOptions.slipTitle}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-neutral-500">
                  {publicCopy.paymentOptions.slipBody}
                </p>
                <Link
                  href="/payment/upload-slip"
                  className="mt-10 inline-flex w-full justify-center rounded-full border-2 border-neutral-200 bg-white px-8 py-5 text-sm font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white hover:border-neutral-900 hover:shadow-xl hover:shadow-neutral-900/20 active:scale-[0.98]"
                >
                  {publicCopy.paymentOptions.slipCta}
                </Link>
              </section>
            </div>

            <div className="mt-12 pt-12 border-t border-white/10 text-center">
              <Link
                href={`/register?bootcamp=${encodeURIComponent(data.selected_bootcamps.join(","))}`}
                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                </svg>
                {publicCopy.paymentOptions.back}
              </Link>
            </div>
          </section>

        </div>
      </div>
    </PublicShell>
  );
}
