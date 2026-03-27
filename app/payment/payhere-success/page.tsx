import Link from "next/link";
import { redirect } from "next/navigation";

import { CountdownCard } from "@/components/countdown-card";
import { ProcessingRefresh } from "@/components/processing-refresh";
import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { RegistrationSessionCleaner } from "@/components/registration-session-cleaner";
import { supportContact } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { prisma } from "@/lib/db";
import { getDeadline } from "@/lib/server-config";
import { getSession } from "@/lib/session";
import {
  getBootcampWhatsappLink,
  getStudentByPayHereLookup,
} from "@/lib/student-service";
import { formatCurrency, formatSimpleDate } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ order_id?: string }>;
};

export default async function PayHereSuccessPage({ searchParams }: Props) {
  const { order_id } = await searchParams;
  const session = await getSession();
  const student = await getStudentByPayHereLookup(
    order_id ?? session.payhere_order_id,
    session.registration_id,
  );

  if (!student) {
    redirect("/");
  }

  const completed = student.payment_status === "completed";

  // Fetch all registered bootcamps for this session
  const baseRegId = student.registration_id.split("-")[0];
  const allRecords = await prisma.student.findMany({
    where: {
      OR: [
        { registration_id: baseRegId },
        { registration_id: { startsWith: `${baseRegId}-` } },
      ],
    },
  });

  const bootcampNames = allRecords.map((r) => r.selected_diploma);
  const whatsappLink = getBootcampWhatsappLink(bootcampNames[0]);

  return (
    <PublicShell>
      {completed ? <RegistrationSessionCleaner /> : null}
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-12 py-8 px-2">
        <div className="w-full space-y-8">
          <CountdownCard deadline={getDeadline()} title={publicCopy.countdown.title} />
          <ProgressStepper
            title={publicCopy.register.progressTitle}
            step={
              completed
                ? publicCopy.paymentSuccess.completedStep
                : publicCopy.paymentSuccess.processingStep
            }
            labels={publicCopy.register.steps}
            current={3}
          />
        </div>

        <div className="w-full flex flex-col space-y-10">
          <div className="hidden print:block print:mb-8 print:border-b-2 print:border-neutral-900 print:pb-4">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-neutral-900">Official Registration Receipt</h1>
            <p className="text-sm text-neutral-500 mt-1">CCA Education Programs — Powered by Codezela</p>
          </div>

          <section
            className={`relative overflow-hidden rounded-[2.5rem] border p-8 sm:p-12 ${
              completed ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"
            }`}
          >
            <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-3xl ${completed ? "bg-emerald-500 shadow-emerald-200" : "bg-amber-500 shadow-amber-200"} text-white shadow-xl animate-in zoom-in duration-500 no-print`}>
              {completed ? (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-8 w-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </div>
            <h1 className={`text-4xl font-bold tracking-tight ${completed ? "text-emerald-950" : "text-amber-950"}`}>
              {completed
                ? publicCopy.paymentSuccess.completedHeading
                : publicCopy.paymentSuccess.processingHeading}
            </h1>
            <p className={`mt-4 text-lg font-medium leading-relaxed ${completed ? "text-emerald-900" : "text-amber-900"}`}>
              {completed
                ? publicCopy.paymentSuccess.completedSubheading
                : publicCopy.paymentSuccess.processingBody}
            </p>
            {completed ? (
              <p className="mt-4 text-base leading-7 text-emerald-800/80">
                {publicCopy.paymentSuccess.completedWelcome.replace(
                  "{{ $student->full_name }}",
                  student.full_name,
                )}
              </p>
            ) : (
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/60 p-4 border border-amber-200/50 w-fit no-print">
                <ProcessingRefresh />
                <span className="text-sm font-semibold text-amber-900">
                  {publicCopy.paymentSuccess.processingRefresh.replace("5s...", "Checking status...")}
                </span>
              </div>
            )}
            {!completed ? (
              <Link
                href={`/payment/payhere-success?order_id=${encodeURIComponent(student.payhere_order_id ?? "")}`}
                className="mt-10 inline-flex justify-center rounded-xl bg-neutral-900 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.98] shadow-lg shadow-neutral-900/10 no-print"
              >
                {publicCopy.paymentSuccess.processingAction}
              </Link>
            ) : null}
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
            <h2 className="text-xl font-medium text-neutral-900">
              {publicCopy.paymentSuccess.registrationCardTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {publicCopy.paymentSuccess.registrationCardBody}
            </p>
            <div className={`mt-8 rounded-[1.5rem] border ${completed ? "border-emerald-200 bg-white" : "border-neutral-200 bg-neutral-50"} p-8 shadow-sm`}>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">
                {publicCopy.paymentSuccess.registrationCardSubtitle}(s)
              </div>
              <div className="flex flex-wrap gap-3">
                {allRecords.map((r) => (
                  <div key={r.registration_id} className="rounded-xl border border-neutral-100 bg-neutral-900 px-5 py-3 text-lg font-black tracking-tight text-white shadow-lg shadow-neutral-900/10 print:bg-neutral-100 print:text-neutral-900">
                    {r.registration_id}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
            <h2 className="text-xl font-medium text-neutral-900">
              {publicCopy.paymentSuccess.paymentCardTitle}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PaymentLine
                label={publicCopy.paymentSuccess.paymentLabels.status}
                value={
                  completed
                    ? publicCopy.paymentSuccess.paymentLabels.completed
                    : publicCopy.paymentSuccess.paymentLabels.processing
                }
              />
              <PaymentLine
                label={publicCopy.paymentSuccess.paymentLabels.orderId}
                value={
                  student.payhere_order_id ??
                  publicCopy.paymentSuccess.paymentLabels.pending
                }
              />
              <PaymentLine
                label={publicCopy.paymentSuccess.paymentLabels.amountPaid}
                value={formatCurrency(student.amount_paid?.toString() ?? (3000 * bootcampNames.length).toString())}
              />
              <PaymentLine
                label={publicCopy.paymentSuccess.paymentLabels.paymentDate}
                value={formatSimpleDate(student.payment_date)}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6 sm:p-10">
            <h2 className="text-xl font-medium text-neutral-900">
              {publicCopy.paymentSuccess.detailsTitle}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PaymentLine
                label={publicCopy.paymentSuccess.detailsLabels.studentName}
                value={student.full_name}
              />
              <PaymentLine
                label={publicCopy.paymentSuccess.detailsLabels.selectedCourse}
                value={bootcampNames.join(" & ")}
              />
              <PaymentLine
                label={publicCopy.paymentSuccess.detailsLabels.email}
                value={student.email}
              />
              <PaymentLine
                label={publicCopy.paymentSuccess.detailsLabels.whatsapp}
                value={student.whatsapp_number}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10 no-print">
            {completed ? (
              <>
                <h2 className="text-xl font-medium text-neutral-900">
                  {publicCopy.paymentSuccess.nextStepsTitle}
                </h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {publicCopy.paymentSuccess.nextSteps.map(([title, body], idx) => (
                    <div
                      key={title}
                      className="group relative rounded-3xl border border-neutral-100 bg-neutral-50 p-6 transition-all hover:border-neutral-900/20 hover:bg-white hover:shadow-lg"
                    >
                      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-white text-[10px] font-bold">
                        {idx + 1}
                      </div>
                      <dt className="text-xs font-bold tracking-widest uppercase text-neutral-900">
                        {title}
                      </dt>
                      <dd className="mt-3 text-sm leading-6 text-neutral-600">
                        {body}
                      </dd>
                    </div>
                  ))}
                </div>
                <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-10 border-t border-neutral-100">
                  <a
                    href={`/payment/receipt/${student.id}?download=true`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-neutral-900 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.98] shadow-lg shadow-neutral-900/10"
                  >
                    {publicCopy.paymentSuccess.buttons.receipt}
                  </a>
                  <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-neutral-300 bg-white px-10 py-4 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                  >
                    {publicCopy.paymentSuccess.buttons.home}
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/payment/options"
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-neutral-900 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
                >
                  {publicCopy.paymentSuccess.buttons.retry}
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-neutral-300 bg-white px-10 py-4 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50"
                >
                  {publicCopy.paymentSuccess.buttons.home}
                </Link>
              </div>
            )}
          </section>

          {completed && whatsappLink ? (
            <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 sm:p-10">
              <h2 className="text-xl font-medium text-emerald-950">
                {publicCopy.paymentSuccess.whatsappTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-emerald-900">
                {publicCopy.paymentSuccess.whatsappBody}
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex justify-center items-center gap-3 rounded-xl bg-[#25D366] px-10 py-5 text-base font-bold text-white transition-all hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-[#25D366]/20 active:scale-[0.98] w-full sm:w-auto"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {publicCopy.paymentSuccess.whatsappTitle}
              </a>
            </section>
          ) : null}

          <section className="rounded-[2rem] border border-sky-100 bg-sky-50 p-6 sm:p-10">
            <h2 className="text-xl font-medium text-sky-950">
              {publicCopy.paymentSuccess.supportTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-sky-900">
              {publicCopy.paymentSuccess.supportBody}
            </p>
            <div className="mt-6 space-y-2 text-sm font-medium text-sky-800">
              <p>{supportContact.phone}</p>
              <p>{supportContact.email}</p>
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-sky-200/50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">Reference IDs:</span>
                <span className="text-sky-950 font-bold">{allRecords.map(r => r.registration_id).join(", ")}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}

function PaymentLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 transition-all hover:border-neutral-200">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-neutral-900 line-clamp-1">{value}</dd>
    </div>
  );
}
