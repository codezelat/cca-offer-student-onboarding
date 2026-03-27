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

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={adminCopy.edit.labels.full_name}>
          <input value={values.full_name} onChange={(e) => update("full_name", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.name_with_initials}>
          <input value={values.name_with_initials} onChange={(e) => update("name_with_initials", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.gender}>
          <select value={values.gender} onChange={(e) => update("gender", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label={adminCopy.edit.labels.nic}>
          <input value={values.nic} onChange={(e) => update("nic", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.date_of_birth}>
          <input type="date" value={values.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.whatsapp_number}>
          <input value={values.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.home_contact_number}>
          <input value={values.home_contact_number} onChange={(e) => update("home_contact_number", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.email}>
          <input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.permanent_address}>
          <textarea value={values.permanent_address} onChange={(e) => update("permanent_address", e.target.value)} rows={4} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.postal_code}>
          <input value={values.postal_code} onChange={(e) => update("postal_code", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all" />
        </Field>
        <Field label={adminCopy.edit.labels.district}>
          <select value={values.district} onChange={(e) => update("district", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat">
            <option value="">{adminCopy.edit.labels.districtPlaceholder}</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </Field>
        <Field label={adminCopy.edit.labels.selected_diploma}>
          <select value={values.selected_diploma} onChange={(e) => update("selected_diploma", e.target.value)} className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat">
            <option value="">{adminCopy.edit.labels.diplomaPlaceholder}</option>
            {diplomas.map((bootcamp) => (
              <option key={bootcamp} value={bootcamp}>
                {bootcamp}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="rounded-[2.5rem] border-2 border-neutral-100 bg-neutral-50/50 p-10 mt-12">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase italic mb-10">
          {adminCopy.edit.paymentTitle}
        </h2>
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Readonly label={adminCopy.edit.labels.registration_id} value={values.registration_id} />
          <Readonly label={adminCopy.edit.labels.payment_method} value={values.payment_method || "Not Selected"} />
          <Readonly label={adminCopy.edit.labels.payment_status} value={values.payment_status || "Pending"} />
          <Readonly label={adminCopy.edit.labels.amount_paid} value={values.amount_paid ? `Rs. ${Number(values.amount_paid).toLocaleString()}` : "Rs. 0.00"} />
        </dl>
      </div>

      <div className="flex flex-wrap gap-4 pt-10 border-t border-neutral-100">
        <button type="submit" disabled={submitting} className="rounded-full bg-neutral-900 px-12 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-neutral-900/10 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60">
          {submitting ? "Saving Changes..." : adminCopy.edit.actions.submit}
        </button>
        <button type="button" onClick={() => router.push("/cca-admin-area/dashboard")} className="rounded-full border-2 border-neutral-200 bg-white px-12 py-5 text-sm font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]">
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
      <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-4">{label}</span>
      {children}
    </label>
  );
}

function Readonly({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border-2 border-neutral-100 bg-white p-7 group-hover:border-neutral-900 transition-all shadow-sm">
      <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 px-1 border-b border-neutral-50 pb-2">
        {label}
      </dt>
      <dd className="text-base font-bold text-neutral-900 tracking-tight">{value}</dd>
    </div>
  );
}
