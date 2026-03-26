"use client";

import Link from "next/link";
import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { publicCopy } from "@/lib/content/public";
import { supportContact, districts } from "@/lib/config";
import { validateSriLankanNic } from "@/lib/nic";
import type { FormErrors, RegistrationData } from "@/lib/types";

type RegisterFormProps = {
  diploma: string;
  registrationId: string;
  courseLink?: string;
};

type RegisterState = RegistrationData;

const defaultState = (diploma: string, registrationId: string): RegisterState => ({
  registration_id: registrationId,
  full_name: "",
  name_with_initials: "",
  gender: "male",
  nic: "",
  date_of_birth: "",
  email: "",
  permanent_address: "",
  postal_code: "",
  district: "",
  home_contact_number: "",
  whatsapp_number: "",
  terms_accepted: false,
  selected_diploma: diploma,
});

export function RegisterForm({
  diploma,
  registrationId,
  courseLink,
}: RegisterFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<RegisterState>(() =>
    defaultState(diploma, registrationId),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const nicStatus = useMemo(() => {
    if (!values.nic) {
      return null;
    }
    return validateSriLankanNic(values.nic);
  }, [values.nic]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = await response.json();

    if (!response.ok) {
      setErrors(payload.errors ?? {});
      setSubmitting(false);
      return;
    }

    startTransition(() => {
      router.push("/payment/options");
    });
  }

  function update<K extends keyof RegisterState>(key: K, value: RegisterState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const allErrors = Object.values(errors).flat();

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-6">
        <div className="shadow-card rounded-[2rem] border border-slate-200 bg-white p-8">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            {publicCopy.register.badge}
          </span>
          <div className="mt-4 inline-flex rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
            {diploma}
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
            {publicCopy.register.title}
          </h1>
          <p className="mt-2 text-base leading-7 text-slate-600">
            {publicCopy.register.subtitle}
          </p>

          {allErrors.length > 0 ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5">
              <h2 className="text-sm font-semibold text-rose-800">
                {publicCopy.register.errorsTitle}
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-rose-700">
                {allErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Field
              label={publicCopy.register.fields.registration_id.label}
              helper={publicCopy.register.fields.registration_id.helper}
              fullWidth
            >
              <input
                value={values.registration_id}
                readOnly
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
              />
            </Field>
            <Field
              label={publicCopy.register.fields.full_name.label}
              error={errors.full_name?.[0]}
              fullWidth
            >
              <input
                value={values.full_name}
                onChange={(event) => update("full_name", event.target.value)}
                placeholder={publicCopy.register.fields.full_name.placeholder}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </Field>
            <Field
              label={publicCopy.register.fields.name_with_initials.label}
              error={errors.name_with_initials?.[0]}
              fullWidth
            >
              <input
                value={values.name_with_initials}
                onChange={(event) => update("name_with_initials", event.target.value)}
                placeholder={publicCopy.register.fields.name_with_initials.placeholder}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </Field>
            <Field label={publicCopy.register.fields.gender.label} error={errors.gender?.[0]} fullWidth>
              <select
                value={values.gender}
                onChange={(event) => update("gender", event.target.value as RegisterState["gender"])}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              >
                <option value="male">
                  {publicCopy.register.fields.gender.options.male}
                </option>
                <option value="female">
                  {publicCopy.register.fields.gender.options.female}
                </option>
              </select>
            </Field>
            <Field label={publicCopy.register.fields.date_of_birth.label} error={errors.date_of_birth?.[0]}>
              <input
                type="date"
                value={values.date_of_birth}
                onChange={(event) => update("date_of_birth", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </Field>
            <Field
              label={publicCopy.register.fields.nic.label}
              error={errors.nic?.[0]}
              helper={publicCopy.register.fields.nic.hints.join(" / ")}
            >
              <input
                value={values.nic}
                onChange={(event) => update("nic", event.target.value)}
                placeholder={publicCopy.register.fields.nic.placeholder}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              {nicStatus?.message ? (
                <p
                  className={`mt-2 text-xs ${nicStatus.valid ? "text-emerald-700" : "text-rose-600"}`}
                >
                  {nicStatus.message}
                </p>
              ) : null}
            </Field>
            <Field label={publicCopy.register.fields.email.label} error={errors.email?.[0]}>
              <input
                type="email"
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder={publicCopy.register.fields.email.placeholder}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </Field>
            <Field
              label={publicCopy.register.fields.permanent_address.label}
              error={errors.permanent_address?.[0]}
              fullWidth
            >
              <textarea
                value={values.permanent_address}
                onChange={(event) => update("permanent_address", event.target.value)}
                placeholder={publicCopy.register.fields.permanent_address.placeholder}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </Field>
            <Field label={publicCopy.register.fields.postal_code.label} error={errors.postal_code?.[0]}>
              <input
                value={values.postal_code}
                onChange={(event) => update("postal_code", event.target.value)}
                placeholder={publicCopy.register.fields.postal_code.placeholder}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </Field>
            <Field label={publicCopy.register.fields.district.label} error={errors.district?.[0]}>
              <select
                value={values.district}
                onChange={(event) => update("district", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              >
                <option value="">
                  {publicCopy.register.fields.district.placeholder}
                </option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label={publicCopy.register.fields.home_contact_number.label}
              error={errors.home_contact_number?.[0]}
            >
              <input
                value={values.home_contact_number}
                onChange={(event) => update("home_contact_number", event.target.value)}
                placeholder={publicCopy.register.fields.home_contact_number.placeholder}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </Field>
            <Field
              label={publicCopy.register.fields.whatsapp_number.label}
              error={errors.whatsapp_number?.[0]}
            >
              <input
                value={values.whatsapp_number}
                onChange={(event) => update("whatsapp_number", event.target.value)}
                placeholder={publicCopy.register.fields.whatsapp_number.placeholder}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </Field>
          </div>

          <label className="mt-6 flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={values.terms_accepted}
              onChange={(event) => update("terms_accepted", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm leading-6 text-slate-700">
              {publicCopy.register.fields.terms_accepted}
            </span>
          </label>
          {errors.terms_accepted?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">{errors.terms_accepted[0]}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {publicCopy.register.actions.submit}
            </button>
            <Link
              href="/select-diploma"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            >
              {publicCopy.register.actions.back}
            </Link>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-sky-100 bg-sky-50 p-6 shadow-card">
          <h2 className="text-lg font-semibold text-sky-950">
            {publicCopy.register.help.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-sky-900">
            {publicCopy.register.help.body}
          </p>
          <a
            href={`https://wa.me/${supportContact.whatsapp.replace(/\D/g, "")}`}
            className="mt-4 inline-flex rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {supportContact.whatsapp}
          </a>
        </div>
        {courseLink ? (
          <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-6 shadow-card">
            <h2 className="text-lg font-semibold text-rose-950">
              {publicCopy.register.courseCard.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-rose-900">
              {publicCopy.register.courseCard.body.replace("{{ $diploma }}", diploma)}
            </p>
            <a
              href={courseLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
            >
              {publicCopy.register.courseCard.cta}
            </a>
          </div>
        ) : null}
      </aside>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
};

function Field({ label, error, helper, fullWidth, children }: FieldProps) {
  return (
    <label className={fullWidth ? "sm:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold text-slate-900">{label}</span>
      {children}
      {helper ? <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}
