import Link from "next/link";
import { redirect } from "next/navigation";

import { CountdownCard } from "@/components/countdown-card";
import { ProcessingRefresh } from "@/components/processing-refresh";
import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { RegistrationSessionCleaner } from "@/components/registration-session-cleaner";
import { getDeadline, supportContact } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { prisma } from "@/lib/db";
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
          <section
            className={`rounded-[2rem] border p-6 sm:p-10 ${
              completed ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
            }`}
          >
            <h1 className={`text-3xl font-medium tracking-tight ${completed ? "text-emerald-950" : "text-amber-950"}`}>
              {completed
                ? publicCopy.paymentSuccess.completedHeading
                : publicCopy.paymentSuccess.processingHeading}
            </h1>
            <p className={`mt-4 text-lg leading-8 ${completed ? "text-emerald-900" : "text-amber-900"}`}>
              {completed
                ? publicCopy.paymentSuccess.completedSubheading
                : publicCopy.paymentSuccess.processingBody}
            </p>
            {completed ? (
              <p className="mt-4 text-base leading-7 text-emerald-800">
                {publicCopy.paymentSuccess.completedWelcome.replace(
                  "{{ $student->full_name }}",
                  student.full_name,
                )}
              </p>
            ) : (
              <p className="mt-4 text-base leading-7 text-amber-800">
                {publicCopy.paymentSuccess.processingRefresh.replace("5s...", "")}
                <ProcessingRefresh />
              </p>
            )}
            {!completed ? (
              <Link
                href={`/payment/payhere-success?order_id=${encodeURIComponent(student.payhere_order_id ?? "")}`}
                className="mt-8 inline-flex justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white w-full sm:w-auto"
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
            <div className="mt-8 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {publicCopy.paymentSuccess.registrationCardSubtitle}
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
                {baseRegId}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
            <h2 className="text-xl font-medium text-neutral-900">
              {publicCopy.paymentSuccess.paymentCardTitle}
            </h2>
            <dl className="mt-8 space-y-4">
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

          <section className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6 sm:p-10">
            <h2 className="text-xl font-medium text-neutral-900">
              {publicCopy.paymentSuccess.detailsTitle}
            </h2>
            <dl className="mt-8 space-y-4">
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
            </dl>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
            {completed ? (
              <>
                <h2 className="text-xl font-medium text-neutral-900">
                  {publicCopy.paymentSuccess.nextStepsTitle}
                </h2>
                <div className="mt-8 space-y-4">
                  {publicCopy.paymentSuccess.nextSteps.map(([title, body]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
                    >
                      <div className="text-sm font-semibold tracking-widest uppercase text-neutral-900">
                        {title}
                      </div>
                      <div className="mt-2 text-sm leading-6 text-neutral-700">
                        {body}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a
                    href={`/payment/receipt/${student.id}`}
                    className="w-full sm:w-auto inline-flex justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                  >
                    {publicCopy.paymentSuccess.buttons.receipt}
                  </a>
                  <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex justify-center rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
                  >
                    {publicCopy.paymentSuccess.buttons.home}
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/payment/options"
                  className="w-full sm:w-auto inline-flex justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  {publicCopy.paymentSuccess.buttons.retry}
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex justify-center rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
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
                className="mt-6 inline-flex justify-center rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a] w-full sm:w-auto"
              >
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
            <div className="mt-6 space-y-1 text-sm font-medium text-sky-800">
              <p>{supportContact.phone}</p>
              <p>{supportContact.email}</p>
              <p>Registration ID: <span className="text-sky-950">{student.registration_id}</span></p>
            </div>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}

function PaymentLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-neutral-100 pb-3 last:border-none last:pb-0">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1 sm:mb-0">
        {label}
      </dt>
      <dd className="text-sm font-medium text-neutral-900 text-left sm:text-right">{value}</dd>
    </div>
  );
}
