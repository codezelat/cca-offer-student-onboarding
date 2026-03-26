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
    <PublicShell wide>
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
          <ProgressStepper
            title={publicCopy.register.progressTitle}
            step={publicCopy.uploadSlip.step}
            labels={["Details", "Payment", "Upload Slip"]}
            current={3}
          />
          <CountdownCard
            deadline={getDeadline()}
            title={publicCopy.countdown.title}
            shortLabels
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
            <div className="inline-flex rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">
              {publicCopy.register.badge}
            </div>
            <div className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
              {data.selected_diploma}
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
              {publicCopy.uploadSlip.title}
            </h1>
            <p className="mt-2 text-base leading-7 text-slate-600">
              {publicCopy.uploadSlip.subtitle}
            </p>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-950">
                {publicCopy.uploadSlip.registrationDetails}
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
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
                  value={data.selected_diploma}
                />
                <Detail
                  label={publicCopy.uploadSlip.labels.amountToPay}
                  value={publicCopy.uploadSlip.labels.amount}
                />
              </dl>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-blue-100 bg-blue-50 p-6">
              <h2 className="text-xl font-semibold text-blue-950">
                {publicCopy.uploadSlip.bankTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-900">
                {publicCopy.uploadSlip.bankSubtitle}
              </p>
              <div className="mt-4 space-y-4">
                {bankAccounts.map((account) => (
                  <div
                    key={account.bank}
                    className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-card"
                  >
                    <h3 className="text-lg font-semibold text-slate-950">{account.bank}</h3>
                    <dl className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      <div>
                        <dt className="inline font-semibold">
                          {publicCopy.uploadSlip.bankLabels.accountNumber}{" "}
                        </dt>
                        <dd className="inline">{account.accountNumber}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold">
                          {publicCopy.uploadSlip.bankLabels.accountName}{" "}
                        </dt>
                        <dd className="inline">{account.accountName}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold">
                          {publicCopy.uploadSlip.bankLabels.branch}{" "}
                        </dt>
                        <dd className="inline">{account.branch}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <p className="font-semibold">{publicCopy.uploadSlip.warningAmount}</p>
              <p className="mt-2">{publicCopy.uploadSlip.warningReference}</p>
            </div>

            <form
              action="/api/payment/store-slip"
              method="post"
              encType="multipart/form-data"
              className="mt-6 space-y-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  {publicCopy.uploadSlip.uploadField}
                </label>
                <SlipUploadField />
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
                >
                  {publicCopy.uploadSlip.submit}
                </button>
                <a
                  href="/payment/options"
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
                >
                  {publicCopy.uploadSlip.back}
                </a>
              </div>
            </form>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-950">
                {publicCopy.uploadSlip.notesTitle}
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-6 text-slate-700">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
