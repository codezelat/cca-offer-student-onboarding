"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { adminCopy } from "@/lib/content/admin";

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
  diplomas: readonly string[];
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
      router.push("/cca-admin-area/dashboard?updated=1");
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={adminCopy.edit.labels.full_name}>
          <input value={values.full_name} onChange={(e) => update("full_name", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.name_with_initials}>
          <input value={values.name_with_initials} onChange={(e) => update("name_with_initials", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.gender}>
          <select value={values.gender} onChange={(e) => update("gender", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors appearance-none">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label={adminCopy.edit.labels.nic}>
          <input value={values.nic} onChange={(e) => update("nic", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.date_of_birth}>
          <input type="date" value={values.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.whatsapp_number}>
          <input value={values.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.home_contact_number}>
          <input value={values.home_contact_number} onChange={(e) => update("home_contact_number", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.email}>
          <input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.permanent_address}>
          <textarea value={values.permanent_address} onChange={(e) => update("permanent_address", e.target.value)} rows={4} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.postal_code}>
          <input value={values.postal_code} onChange={(e) => update("postal_code", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors" />
        </Field>
        <Field label={adminCopy.edit.labels.district}>
          <select value={values.district} onChange={(e) => update("district", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors appearance-none">
            <option value="">{adminCopy.edit.labels.districtPlaceholder}</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </Field>
        <Field label={adminCopy.edit.labels.selected_diploma}>
          <select value={values.selected_diploma} onChange={(e) => update("selected_diploma", e.target.value)} className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors appearance-none">
            <option value="">{adminCopy.edit.labels.diplomaPlaceholder}</option>
            {diplomas.map((bootcamp) => (
              <option key={bootcamp} value={bootcamp}>
                {bootcamp}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="rounded-[2.5rem] border border-neutral-100 bg-neutral-50/50 p-8">
        <h2 className="text-xl font-black text-neutral-900 tracking-tight">
          {adminCopy.edit.paymentTitle}
        </h2>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Readonly label={adminCopy.edit.labels.registration_id} value={values.registration_id} />
          <Readonly label={adminCopy.edit.labels.payment_method} value={values.payment_method || "Not Selected"} />
          <Readonly label={adminCopy.edit.labels.payment_status} value={values.payment_status || "Pending"} />
          <Readonly label={adminCopy.edit.labels.amount_paid} value={values.amount_paid ? `Rs. ${Number(values.amount_paid).toLocaleString()}` : "Rs. 0.00"} />
        </dl>
      </div>

      <div className="flex flex-wrap gap-4 pt-8 border-t border-neutral-100">
        <button type="submit" disabled={submitting} className="rounded-xl bg-neutral-900 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-neutral-900/10 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60">
          {submitting ? "Saving Changes..." : adminCopy.edit.actions.submit}
        </button>
        <button type="button" onClick={() => router.push("/cca-admin-area/dashboard")} className="rounded-xl border border-neutral-200 bg-white px-10 py-4 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]">
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
      <span className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-3">{label}</span>
      {children}
    </label>
  );
}

function Readonly({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-neutral-100 bg-white p-5 group-hover:border-neutral-200 transition-colors">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold text-neutral-900">{value}</dd>
    </div>
  );
}
