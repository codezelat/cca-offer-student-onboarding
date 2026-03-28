"use client";

import Link from "next/link";
import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { publicCopy } from "@/lib/content/public";
import { supportContact, districts } from "@/lib/config";
import { validateSriLankanNic } from "@/lib/nic";
import { toast } from "@/lib/toast";
import type { FormErrors, RegistrationData } from "@/lib/types";
import { cn } from "@/lib/utils";

type RegisterFormProps = {
  bootcamps: string[];
  registrationId: string;
  courseLink?: string;
};

type RegisterState = RegistrationData;

const defaultState = (bootcamps: string[], registrationId: string): RegisterState => ({
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
  selected_bootcamps: bootcamps,
});

export function RegisterForm({
  bootcamps,
  registrationId,
  courseLink,
}: RegisterFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<RegisterState>(() =>
    defaultState(bootcamps, registrationId),
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

    try {
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
        toast.error(publicCopy.register.errorsTitle || "Please correct the errors in the form.");
        return;
      }

      startTransition(() => {
        router.push("/payment/options");
      });
    } catch {
      setSubmitting(false);
      toast.error("An unexpected error occurred. Please check your connection.");
    }
  }

  function update<K extends keyof RegisterState>(key: K, value: RegisterState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const allErrors = Object.values(errors).flat();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-10 w-full">
      <div className="space-y-6">
        <div>
          <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {publicCopy.register.badge}
          </span>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-neutral-500">
            <span>Selected Bootcamps:</span>
            {bootcamps.map((bc, idx) => (
              <span key={bc} className="text-neutral-900 font-semibold italic">
                {bc}{idx < bootcamps.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
          <h1 className="mt-6 text-3xl font-medium tracking-tight text-neutral-900">
            {publicCopy.register.title}
          </h1>
          <p className="mt-2 text-base leading-7 text-neutral-600">
            {publicCopy.register.subtitle}
          </p>
        </div>

        {allErrors.length > 0 ? (
          <div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50/50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-rose-900">
                {publicCopy.register.errorsTitle}
              </h2>
            </div>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs font-bold text-rose-800">
              {allErrors.map((error) => (
                <li key={error} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-rose-400" />
                  {error}
                </li>
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-bold text-neutral-500 outline-none"
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
            />
          </Field>
          <Field label={publicCopy.register.fields.gender.label} error={errors.gender?.[0]} fullWidth>
            <select
              value={values.gender}
              onChange={(event) => update("gender", event.target.value as RegisterState["gender"])}
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
            />
            {nicStatus?.message ? (
              <p
                className={cn(
                  "mt-2 text-[10px] font-black uppercase tracking-[0.2em]",
                  nicStatus.valid ? "text-emerald-600" : "text-rose-600"
                )}
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
            />
          </Field>
          <Field label={publicCopy.register.fields.postal_code.label} error={errors.postal_code?.[0]}>
            <input
              value={values.postal_code}
              onChange={(event) => update("postal_code", event.target.value)}
              placeholder={publicCopy.register.fields.postal_code.placeholder}
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
            />
          </Field>
          <Field label={publicCopy.register.fields.district.label} error={errors.district?.[0]}>
            <select
              value={values.district}
              onChange={(event) => update("district", event.target.value)}
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
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
              className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-neutral-900 focus:outline-none focus:ring-0"
            />
          </Field>
        </div>

        <label className="mt-8 flex items-start gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <input
            type="checkbox"
            checked={values.terms_accepted}
            onChange={(event) => update("terms_accepted", event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <span className="text-sm leading-6 text-neutral-700">
            {publicCopy.register.fields.terms_accepted}
          </span>
        </label>
        {errors.terms_accepted?.[0] ? (
          <p className="mt-2 text-sm text-rose-600 font-medium">{errors.terms_accepted[0]}</p>
        ) : null}

        <div className="mt-10 flex flex-col sm:flex-row gap-4 border-b border-neutral-200 pb-10">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
          >
            {submitting ? "Processing..." : publicCopy.register.actions.submit}
          </button>
          <Link
            href="/select-bootcamp"
            className="w-full sm:w-auto inline-flex justify-center rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            {publicCopy.register.actions.back}
          </Link>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50 p-6 sm:p-8">
          <h2 className="text-xl font-medium tracking-tight text-sky-950">
            {publicCopy.register.help.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-sky-900">
            {publicCopy.register.help.body}
          </p>
          <a
            href={`https://wa.me/${supportContact.whatsapp.replace(/\D/g, "")}`}
            className="mt-6 inline-flex justify-center rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a] w-full sm:w-auto"
          >
            {supportContact.whatsapp}
          </a>
        </div>
        {courseLink ? (
          <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50 p-6 sm:p-8">
            <h2 className="text-xl font-medium tracking-tight text-rose-950">
              {publicCopy.register.courseCard.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-rose-900">
              {publicCopy.register.courseCard.body.replace("{{ $diploma }}", bootcamps.join(" & "))}
            </p>
            <a
              href={courseLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex justify-center rounded-full bg-rose-600 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-rose-700 w-full sm:w-auto"
            >
              {publicCopy.register.courseCard.cta}
            </a>
          </div>
        ) : null}
      </div>
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
    <label className={cn("flex flex-col", fullWidth ? "sm:col-span-2" : "col-span-1")}>
      <span className="mb-2 flex items-end text-xs font-black uppercase tracking-widest text-neutral-900 min-h-[44px]">
        {label}
      </span>
      {children}
      {helper ? <p className="mt-2 text-[10px] font-bold leading-5 text-neutral-400 uppercase tracking-widest">{helper}</p> : null}
      {error ? <p className="mt-2 text-xs font-bold text-rose-600 tracking-tight">{error}</p> : null}
    </label>
  );
}
