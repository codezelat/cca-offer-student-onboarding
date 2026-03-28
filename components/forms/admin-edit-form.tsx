"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { StudentRecordDeleteButton } from "@/components/admin/student-record-delete-button";
import { cn } from "@/lib/utils";

type EditableStudent = {
  id: number;
  full_name: string;
  name_with_initials: string;
  gender: "male" | "female";
  nic: string;
  date_of_birth: string;
  whatsapp_number: string;
  home_contact_number: string;
  email: string;
  permanent_address: string;
  postal_code: string;
  district: string;
  selected_diploma: string;
  registration_id: string;
  payment_method: string;
  payment_status: string;
  amount_paid: string;
  payment_date: string;
  payhere_order_id: string;
  payment_slip: string;
  created_at: string;
  updated_at: string;
};

type RelatedRecord = {
  id: number;
  registration_id: string;
  selected_diploma: string;
  payment_status: string;
  payment_method: string;
};

type AdminEditFormProps = {
  student: EditableStudent;
  relatedRecords: RelatedRecord[];
  districts: readonly string[];
  diplomas: readonly string[];
};

type FieldErrors = Record<string, string[]>;

export function AdminEditForm({
  student,
  relatedRecords,
  districts,
  diplomas,
}: AdminEditFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({
    full_name: student.full_name,
    name_with_initials: student.name_with_initials,
    gender: student.gender,
    nic: student.nic,
    date_of_birth: student.date_of_birth,
    whatsapp_number: student.whatsapp_number,
    home_contact_number: student.home_contact_number,
    email: student.email,
    permanent_address: student.permanent_address,
    postal_code: student.postal_code,
    district: student.district,
    selected_diploma: student.selected_diploma,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const siblingRecords = relatedRecords.filter((record) => record.id !== student.id);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    const response = await fetch(`/api/admin/student/${student.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json().catch(() => null)) as
      | { message?: string; errors?: FieldErrors }
      | null;

    if (!response.ok) {
      setFieldErrors(payload?.errors ?? {});
      setFormError(payload?.message ?? "Unable to update student.");
      setSubmitting(false);
      return;
    }

    startTransition(() => {
      router.push(`/cca-admin-area/student/${student.id}?updated=1`);
      router.refresh();
    });
  }

  function update<K extends keyof typeof values>(name: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.3fr_0.85fr]">
      <div className="space-y-6">
        <Section title="Student details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name *" error={fieldErrors.full_name?.[0]}>
              <input
                value={values.full_name}
                onChange={(event) => update("full_name", event.target.value)}
                className={inputClass(fieldErrors.full_name?.[0])}
              />
            </Field>
            <Field label="Name With Initials *" error={fieldErrors.name_with_initials?.[0]}>
              <input
                value={values.name_with_initials}
                onChange={(event) => update("name_with_initials", event.target.value)}
                className={inputClass(fieldErrors.name_with_initials?.[0])}
              />
            </Field>
            <Field label="Gender *" error={fieldErrors.gender?.[0]}>
              <select
                value={values.gender}
                onChange={(event) => update("gender", event.target.value as "male" | "female")}
                className={selectClass(fieldErrors.gender?.[0])}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>
            <Field label="Date of Birth *" error={fieldErrors.date_of_birth?.[0]}>
              <input
                type="date"
                value={values.date_of_birth}
                onChange={(event) => update("date_of_birth", event.target.value)}
                className={inputClass(fieldErrors.date_of_birth?.[0])}
              />
            </Field>
            <Field label="NIC *" error={fieldErrors.nic?.[0]}>
              <input
                value={values.nic}
                onChange={(event) => update("nic", event.target.value)}
                className={inputClass(fieldErrors.nic?.[0])}
              />
            </Field>
            <Field label="Email Address *" error={fieldErrors.email?.[0]}>
              <input
                type="email"
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                className={inputClass(fieldErrors.email?.[0])}
              />
            </Field>
            <Field label="WhatsApp Number *" error={fieldErrors.whatsapp_number?.[0]}>
              <input
                value={values.whatsapp_number}
                onChange={(event) => update("whatsapp_number", event.target.value)}
                className={inputClass(fieldErrors.whatsapp_number?.[0])}
              />
            </Field>
            <Field
              label="Emergency Contact Number *"
              error={fieldErrors.home_contact_number?.[0]}
            >
              <input
                value={values.home_contact_number}
                onChange={(event) => update("home_contact_number", event.target.value)}
                className={inputClass(fieldErrors.home_contact_number?.[0])}
              />
            </Field>
            <Field label="District *" error={fieldErrors.district?.[0]}>
              <select
                value={values.district}
                onChange={(event) => update("district", event.target.value)}
                className={selectClass(fieldErrors.district?.[0])}
              >
                <option value="">Select district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Postal Code" error={fieldErrors.postal_code?.[0]}>
              <input
                value={values.postal_code}
                onChange={(event) => update("postal_code", event.target.value)}
                className={inputClass(fieldErrors.postal_code?.[0])}
              />
            </Field>
            <Field
              label="Permanent Address"
              error={fieldErrors.permanent_address?.[0]}
              className="sm:col-span-2"
            >
              <textarea
                value={values.permanent_address}
                onChange={(event) => update("permanent_address", event.target.value)}
                rows={5}
                className={inputClass(fieldErrors.permanent_address?.[0])}
              />
            </Field>
          </div>
        </Section>

        <Section title="This program">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Selected Bootcamp *" error={fieldErrors.selected_diploma?.[0]}>
              <select
                value={values.selected_diploma}
                onChange={(event) => update("selected_diploma", event.target.value)}
                className={selectClass(fieldErrors.selected_diploma?.[0])}
              >
                <option value="">Select a bootcamp</option>
                {diplomas.map((bootcamp) => (
                  <option key={bootcamp} value={bootcamp}>
                    {bootcamp}
                  </option>
                ))}
              </select>
            </Field>
            <ReadonlyCard label="Registration ID" value={student.registration_id} mono />
          </div>
          {siblingRecords.length > 0 ? (
            <p className="mt-5 text-sm font-medium text-neutral-500">
              This row cannot use a bootcamp already selected in this registration.
            </p>
          ) : null}
        </Section>

        {formError ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
            {formError}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-4 border-t border-neutral-100 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-neutral-900 px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? "Saving Changes..." : "Save Changes"}
          </button>
          <Link
            href={`/cca-admin-area/student/${student.id}`}
            className="rounded-full border-2 border-neutral-200 bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
          >
            Back To Record
          </Link>
          <StudentRecordDeleteButton
            studentId={student.id}
            studentName={student.full_name}
          />
        </div>
      </div>

      <aside className="space-y-6">
        <Section title="Quick info">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <ReadonlyCard label="Payment Method" value={student.payment_method} />
            <ReadonlyCard label="Payment Status" value={student.payment_status} />
            <ReadonlyCard
              label="Amount Paid"
              value={
                student.amount_paid
                  ? `Rs. ${Number(student.amount_paid).toLocaleString()}`
                  : "Rs. 0.00"
              }
            />
            <ReadonlyCard label="Payment Date" value={student.payment_date} />
            <ReadonlyCard label="Updated" value={student.updated_at} />
          </div>

          <div className="mt-6 grid gap-3">
            <a
              href={`/cca-admin-area/student/${student.id}`}
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-4 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900"
            >
              Open Record
            </a>
            <a
              href={`/payment/receipt/${student.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800"
            >
              Open Receipt
            </a>
            {student.payment_slip ? (
              <a
                href={`/files/slips/${student.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 px-5 py-4 text-xs font-black uppercase tracking-widest text-indigo-700 transition-all hover:bg-indigo-100"
              >
                View Slip
              </a>
            ) : null}
          </div>
        </Section>

        <Section title="Programs in this registration">
          <div className="space-y-3">
            {relatedRecords.map((record) => (
              <Link
                key={record.id}
                href={`/cca-admin-area/student/${record.id}${record.id === student.id ? "/edit" : ""}`}
                className={`block rounded-[1.5rem] border p-5 transition-all ${
                  record.id === student.id
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-900 hover:bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="break-words text-base font-black tracking-tight">
                    {record.selected_diploma}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      record.id === student.id
                        ? "bg-white/10 text-white"
                        : "border border-neutral-200 bg-white text-neutral-700"
                    }`}
                  >
                    {record.id === student.id ? "Current" : "Open"}
                  </span>
                </div>
                <p
                  className={`mt-2 break-all text-xs font-bold uppercase tracking-widest ${
                    record.id === student.id ? "text-white/65" : "text-neutral-500"
                  }`}
                >
                  {record.registration_id}
                </p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    record.id === student.id ? "text-white/80" : "text-neutral-600"
                  }`}
                >
                  {record.payment_method} • {record.payment_status}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      </aside>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-neutral-100 bg-neutral-50/40 p-8">
      <h2 className="text-2xl font-black tracking-tight text-neutral-900">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-2 block text-xs font-bold text-rose-600">{error}</span>
      ) : null}
    </label>
  );
}

function ReadonlyCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-neutral-100 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-3 whitespace-pre-wrap text-sm font-bold text-neutral-900",
          mono ? "break-all font-mono text-xs" : "break-words",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function inputClass(hasError?: string) {
  return cn(
    "w-full rounded-2xl border-2 bg-white px-5 py-4 text-sm font-bold text-neutral-900 transition-all focus:outline-none",
    hasError
      ? "border-rose-300 focus:border-rose-500"
      : "border-neutral-100 focus:border-neutral-900",
  );
}

function selectClass(hasError?: string) {
  return cn(
    inputClass(hasError),
    "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat",
  );
}
