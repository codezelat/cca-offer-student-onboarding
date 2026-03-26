import Link from "next/link";
import { redirect } from "next/navigation";

import { CountdownCard } from "@/components/countdown-card";
import { ProcessingRefresh } from "@/components/processing-refresh";
import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { RegistrationSessionCleaner } from "@/components/registration-session-cleaner";
import { getDeadline, supportContact } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { getSession } from "@/lib/session";
import {
  getDiplomaWhatsappLink,
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
  const whatsappLink = getDiplomaWhatsappLink(student.selected_diploma);

  return (
    <PublicShell wide>
      {completed ? <RegistrationSessionCleaner /> : null}
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
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
          <CountdownCard deadline={getDeadline()} title={publicCopy.countdown.title} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <section
            className={`rounded-[2rem] border p-8 shadow-soft ${
              completed ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
            }`}
          >
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              {completed
                ? publicCopy.paymentSuccess.completedHeading
                : publicCopy.paymentSuccess.processingHeading}
            </h1>
            <p className="mt-4 text-xl leading-8 text-slate-800">
              {completed
                ? publicCopy.paymentSuccess.completedSubheading
                : publicCopy.paymentSuccess.processingBody}
            </p>
            {completed ? (
              <p className="mt-4 text-base leading-7 text-slate-700">
                {publicCopy.paymentSuccess.completedWelcome.replace(
                  "{{ $student->full_name }}",
                  student.full_name,
                )}
              </p>
            ) : (
              <p className="mt-4 text-base leading-7 text-slate-700">
                {publicCopy.paymentSuccess.processingRefresh.replace("5s...", "")}
                <ProcessingRefresh />
              </p>
            )}
            {!completed ? (
              <Link
                href={`/payment/payhere-success?order_id=${encodeURIComponent(student.payhere_order_id ?? "")}`}
                className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                {publicCopy.paymentSuccess.processingAction}
              </Link>
            ) : null}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold text-slate-950">
                {publicCopy.paymentSuccess.registrationCardTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {publicCopy.paymentSuccess.registrationCardBody}
              </p>
              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {publicCopy.paymentSuccess.registrationCardSubtitle}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {student.registration_id}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold text-slate-950">
                {publicCopy.paymentSuccess.paymentCardTitle}
              </h2>
              <dl className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
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
                  value={formatCurrency(student.amount_paid?.toString() ?? 4000)}
                />
                <PaymentLine
                  label={publicCopy.paymentSuccess.paymentLabels.paymentDate}
                  value={formatSimpleDate(student.payment_date)}
                />
              </dl>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold text-slate-950">
                {publicCopy.paymentSuccess.detailsTitle}
              </h2>
              <dl className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
                <PaymentLine
                  label={publicCopy.paymentSuccess.detailsLabels.studentName}
                  value={student.full_name}
                />
                <PaymentLine
                  label={publicCopy.paymentSuccess.detailsLabels.selectedCourse}
                  value={`${publicCopy.paymentSuccess.detailsLabels.diplomaPrefix} ${student.selected_diploma}`}
                />
                <PaymentLine
                  label={publicCopy.paymentSuccess.detailsLabels.email}
                  value={student.email}
                />
                <PaymentLine
                  label={publicCopy.paymentSuccess.detailsLabels.whatsapp}
                  value={student.whatsapp_number}
                />
              </dl>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
              {completed ? (
                <>
                  <h2 className="text-xl font-semibold text-slate-950">
                    {publicCopy.paymentSuccess.nextStepsTitle}
                  </h2>
                  <div className="mt-6 space-y-4">
                    {publicCopy.paymentSuccess.nextSteps.map(([title, body]) => (
                      <div
                        key={title}
                        className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="text-sm font-semibold text-slate-950">
                          {title}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-slate-700">
                          {body}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={`/payment/receipt/${student.id}`}
                      className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
                    >
                      {publicCopy.paymentSuccess.buttons.receipt}
                    </a>
                    <Link
                      href="/"
                      className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
                    >
                      {publicCopy.paymentSuccess.buttons.home}
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Link
                    href="/payment/options"
                    className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
                  >
                    {publicCopy.paymentSuccess.buttons.retry}
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
                  >
                    {publicCopy.paymentSuccess.buttons.home}
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>

        {completed && whatsappLink ? (
          <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 shadow-card">
            <h2 className="text-xl font-semibold text-emerald-950">
              {publicCopy.paymentSuccess.whatsappTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-emerald-900">
              {publicCopy.paymentSuccess.whatsappBody}
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
            >
              {publicCopy.paymentSuccess.whatsappTitle}
            </a>
          </section>
        ) : null}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
          <h2 className="text-xl font-semibold text-slate-950">
            {publicCopy.paymentSuccess.supportTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {publicCopy.paymentSuccess.supportBody}
          </p>
          <div className="mt-4 space-y-1 text-sm text-slate-700">
            <p>{supportContact.phone}</p>
            <p>{supportContact.email}</p>
            <p>Registration ID: {student.registration_id}</p>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}

function PaymentLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-none last:pb-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </dt>
      <dd className="text-right text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
