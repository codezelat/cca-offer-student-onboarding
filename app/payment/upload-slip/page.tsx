import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { ProgressStepper } from "@/components/progress-stepper";
import { SlipUploadField } from "@/components/forms/slip-upload-field";
import { bankAccounts, getDeadline } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { getRegistrationSessionOrRedirect } from "@/lib/flow";

export default async function UploadSlipPage() {
  const data = await getRegistrationSessionOrRedirect();

  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-12 py-8 px-2">
        
        <div className="w-full space-y-8">
          <CountdownCard
            deadline={getDeadline()}
            title={publicCopy.countdown.title}
            shortLabels
          />
          <ProgressStepper
            title={publicCopy.register.progressTitle}
            step={publicCopy.uploadSlip.step}
            labels={["Details", "Payment", "Upload Slip"]}
            current={3}
          />
        </div>

        <div className="w-full flex flex-col space-y-10">
          
          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
            <div className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {publicCopy.register.badge}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-neutral-500">
              <span>Selected Bootcamps:</span>
              {data.selected_bootcamps.map((bc, idx) => (
                <span key={bc} className="text-neutral-900 font-semibold italic">
                  {bc}{idx < data.selected_bootcamps.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <h1 className="mt-6 text-3xl font-medium tracking-tight text-neutral-900">
              {publicCopy.uploadSlip.title}
            </h1>
            <p className="mt-2 text-base leading-7 text-neutral-600">
              {publicCopy.uploadSlip.subtitle}
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-6">
              <h2 className="text-lg font-medium text-neutral-900">
                {publicCopy.uploadSlip.registrationDetails}
              </h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <Detail
                  label={publicCopy.uploadSlip.labels.registrationId}
                  value={data.registration_id}
                />
                <Detail
                  label={publicCopy.uploadSlip.labels.studentName}
                  value={data.full_name}
                />
                <Detail
                  label={publicCopy.uploadSlip.labels.selectedDiploma}
                  value={data.selected_bootcamps.join(" & ")}
                />
                <Detail
                  label={publicCopy.uploadSlip.labels.amountToPay}
                  value={`Rs. ${(3000 * data.selected_bootcamps.length).toLocaleString()}`}
                />
              </dl>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-medium text-neutral-900">
                {publicCopy.uploadSlip.bankTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {publicCopy.uploadSlip.bankSubtitle}
              </p>
              <div className="mt-6 space-y-6">
                {bankAccounts.map((account) => (
                  <div
                    key={account.bank}
                    className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50 p-5"
                  >
                    <h3 className="text-base font-semibold text-neutral-900">{account.bank}</h3>
                    <dl className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                      <div className="flex sm:justify-between flex-col sm:flex-row border-b border-neutral-200 pb-2">
                        <dt className="font-semibold text-xs tracking-widest uppercase text-neutral-500">
                          {publicCopy.uploadSlip.bankLabels.accountNumber}
                        </dt>
                        <dd className="font-medium">{account.accountNumber}</dd>
                      </div>
                      <div className="flex sm:justify-between flex-col sm:flex-row border-b border-neutral-200 pb-2">
                        <dt className="font-semibold text-xs tracking-widest uppercase text-neutral-500">
                          {publicCopy.uploadSlip.bankLabels.accountName}
                        </dt>
                        <dd className="font-medium">{account.accountName}</dd>
                      </div>
                      <div className="flex sm:justify-between flex-col sm:flex-row">
                        <dt className="font-semibold text-xs tracking-widest uppercase text-neutral-500">
                          {publicCopy.uploadSlip.bankLabels.branch}
                        </dt>
                        <dd className="font-medium">{account.branch}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-neutral-50 p-6 sm:p-10 border border-neutral-200">
            <div className="rounded-2xl border-l-4 border-l-neutral-900 border-neutral-200 bg-white p-5 text-sm leading-6 text-neutral-900">
              <p className="font-semibold">{publicCopy.uploadSlip.warningAmount}</p>
              <p className="mt-2">{publicCopy.uploadSlip.warningReference}</p>
            </div>

            <form
              action="/api/payment/store-slip"
              method="post"
              encType="multipart/form-data"
              className="mt-8 space-y-8"
            >
              <div>
                <label className="mb-3 block text-sm font-semibold uppercase tracking-widest text-neutral-900">
                  {publicCopy.uploadSlip.uploadField}
                </label>
                <div className="rounded-2xl bg-white border border-neutral-200 p-2 overflow-hidden hover:border-neutral-400 transition-colors">
                  <SlipUploadField />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  {publicCopy.uploadSlip.submit}
                </button>
                <a
                  href="/payment/options"
                  className="w-full sm:w-auto inline-flex justify-center rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
                >
                  {publicCopy.uploadSlip.back}
                </a>
              </div>
            </form>

            <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                {publicCopy.uploadSlip.notesTitle}
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-6 text-sm leading-6 text-neutral-600">
                {publicCopy.uploadSlip.notes.map((note) => (
                  <li key={note}>{note}</li>
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
    <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-4">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-neutral-900">{value}</dd>
    </div>
  );
}
