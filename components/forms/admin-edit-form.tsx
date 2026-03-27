"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { adminCopy } from "@/lib/content/admin";
import type { DiplomaConfig } from "@/lib/types";

type AdminEditFormProps = {
  student: {
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
  };
  districts: readonly string[];
  diplomas: string[];
};

export function AdminEditForm({
  student,
  districts,
  diplomas,
}: AdminEditFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(student);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/admin/student/${student.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.message ?? "Unable to update student.");
      setSubmitting(false);
      return;
    }

    startTransition(() => {
      router.push("/sitc-admin-area/dashboard?updated=1");
      router.refresh();
    });
  }

  function update(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={adminCopy.edit.labels.full_name}>
          <input value={values.full_name} onChange={(e) => update("full_name", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.name_with_initials}>
          <input value={values.name_with_initials} onChange={(e) => update("name_with_initials", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.gender}>
          <select value={values.gender} onChange={(e) => update("gender", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label={adminCopy.edit.labels.nic}>
          <input value={values.nic} onChange={(e) => update("nic", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.date_of_birth}>
          <input type="date" value={values.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.whatsapp_number}>
          <input value={values.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.home_contact_number}>
          <input value={values.home_contact_number} onChange={(e) => update("home_contact_number", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.email}>
          <input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.permanent_address}>
          <textarea value={values.permanent_address} onChange={(e) => update("permanent_address", e.target.value)} rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.postal_code}>
          <input value={values.postal_code} onChange={(e) => update("postal_code", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </Field>
        <Field label={adminCopy.edit.labels.district}>
          <select value={values.district} onChange={(e) => update("district", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="">{adminCopy.edit.labels.districtPlaceholder}</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </Field>
        <Field label={adminCopy.edit.labels.selected_diploma}>
          <select value={values.selected_diploma} onChange={(e) => update("selected_diploma", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="">{adminCopy.edit.labels.diplomaPlaceholder}</option>
            {diplomas.map((bootcamp) => (
              <option key={bootcamp} value={bootcamp}>
                {bootcamp}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          {adminCopy.edit.paymentTitle}
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Readonly label={adminCopy.edit.labels.registration_id} value={values.registration_id} />
          <Readonly label={adminCopy.edit.labels.payment_method} value={values.payment_method || "-"} />
          <Readonly label={adminCopy.edit.labels.payment_status} value={values.payment_status || "-"} />
          <Readonly label={adminCopy.edit.labels.amount_paid} value={values.amount_paid || "-"} />
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {adminCopy.edit.actions.submit}
        </button>
        <button type="button" onClick={() => router.push("/sitc-admin-area/dashboard")} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900">
          {adminCopy.edit.actions.cancel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-900">{label}</span>
      {children}
    </label>
  );
}

function Readonly({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
