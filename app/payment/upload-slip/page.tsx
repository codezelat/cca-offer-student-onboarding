import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { ProgressStepper } from "@/components/progress-stepper";
import { SlipUploadForm } from "@/components/forms/slip-upload-form";
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

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </div>

            <div className="mt-12 rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                {publicCopy.uploadSlip.bankTitle}
              </h2>
              <p className="mt-2 text-base font-semibold text-emerald-600 bg-emerald-50 inline-block px-4 py-1 rounded-full border border-emerald-100">
                Total Amount: Rs. {(3000 * data.selected_bootcamps.length).toLocaleString()}
              </p>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                {publicCopy.uploadSlip.bankSubtitle}
              </p>
              <div className={`mt-10 ${bankAccounts.length === 1 ? 'max-w-xl mx-auto' : 'grid gap-6 sm:grid-cols-2'}`}>
                {bankAccounts.map((account) => (
                  <div
                    key={account.bank}
                    className="group relative rounded-[2.5rem] border border-neutral-100 bg-neutral-50 p-10 transition-all hover:border-neutral-900 hover:shadow-2xl hover:bg-white"
                  >
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-neutral-900 text-white shadow-xl shadow-neutral-900/10 transition-transform group-hover:scale-105">
                      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-neutral-900 italic">{account.bank}</h3>
                    <dl className="mt-8 space-y-6">
                      <div className="flex flex-col gap-1.5 border-b border-neutral-200/60 pb-4">
                        <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                          {publicCopy.uploadSlip.bankLabels.accountNumber}
                        </dt>
                        <dd className="text-lg font-black text-neutral-900 tabular-nums tracking-wider">
                          {account.accountNumber}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-1.5 border-b border-neutral-200/60 pb-4">
                        <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                          {publicCopy.uploadSlip.bankLabels.accountName}
                        </dt>
                        <dd className="text-base font-bold text-neutral-900 leading-relaxed">
                          {account.accountName}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                          {publicCopy.uploadSlip.bankLabels.branch}
                        </dt>
                        <dd className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
                          {account.branch}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-neutral-50 p-6 sm:p-10 border border-neutral-200">
            <div className="rounded-2xl border-l-4 border-l-emerald-500 border-neutral-200 bg-white p-6 text-sm leading-6 text-neutral-900 shadow-sm">
              <p className="font-bold text-lg">Amount to Transfer: Rs. {(3000 * data.selected_bootcamps.length).toLocaleString()} <span className="text-neutral-500 font-medium text-sm">— for {data.selected_bootcamps.length} program(s)</span></p>
              <p className="mt-2 text-neutral-600 font-medium">{publicCopy.uploadSlip.warningReference}</p>
            </div>

            <SlipUploadForm registrationId={data.registration_id} />

            <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 px-3">
                {publicCopy.uploadSlip.notesTitle}
              </h2>
              <ul className="mt-6 space-y-4 px-3 text-sm leading-6 text-neutral-600">
                {publicCopy.uploadSlip.notes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <svg className="h-5 w-5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {note}
                  </li>
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
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 transition-all hover:border-neutral-200">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-neutral-900 break-all">{value}</dd>
    </div>
  );
}
