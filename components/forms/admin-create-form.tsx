"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";

import { adminCopy } from "@/lib/content/admin";
import { validateSriLankanNic } from "@/lib/nic";
import { buildSlipBlobPath, isAllowedSlipFile } from "@/lib/slip-files";
import { cn } from "@/lib/utils";

type AdminCreateFormProps = {
  districts: readonly string[];
  bootcamps: readonly string[];
};

type FieldErrors = Record<string, string[]>;

type FormValues = {
  full_name: string;
  name_with_initials: string;
  gender: "male" | "female";
  nic: string;
  date_of_birth: string;
  email: string;
  permanent_address: string;
  postal_code: string;
  district: string;
  home_contact_number: string;
  whatsapp_number: string;
  selected_bootcamps: string[];
  payment_setup:
    | "online_completed"
    | "slip_pending"
    | "slip_approved"
    | "study_now_pay_later";
};

const defaultValues: FormValues = {
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
  selected_bootcamps: [],
  payment_setup: "online_completed",
};

export function AdminCreateForm({
  districts,
  bootcamps,
}: AdminCreateFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedSlipLabel, setSelectedSlipLabel] = useState<string | null>(null);

  const nicStatus = useMemo(() => {
    if (!values.nic) {
      return null;
    }

    return validateSriLankanNic(values.nic);
  }, [values.nic]);

  const allErrors = Object.values(fieldErrors).flat();
  const isSlipPayment =
    values.payment_setup === "slip_pending" ||
    values.payment_setup === "slip_approved";

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleBootcamp(bootcamp: string) {
    setValues((current) => {
      const exists = current.selected_bootcamps.includes(bootcamp);

      if (exists) {
        return {
          ...current,
          selected_bootcamps: current.selected_bootcamps.filter(
            (value) => value !== bootcamp,
          ),
        };
      }

      if (current.selected_bootcamps.length >= 2) {
        return current;
      }

      return {
        ...current,
        selected_bootcamps: [...current.selected_bootcamps, bootcamp],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    setUploadProgress(null);

    try {
      let uploadedSlip:
        | {
            pathname: string;
            url: string;
            size: number;
            contentType: string | null;
          }
        | undefined;

      if (isSlipPayment) {
        const input = event.currentTarget.elements.namedItem("payment_slip");
        if (input instanceof HTMLInputElement && input.files?.[0]) {
          const file = input.files[0];

          if (
            !isAllowedSlipFile({
              filename: file.name,
              size: file.size,
              contentType: file.type || null,
            })
          ) {
            setFormError(
              "Please upload a JPG, PNG, PDF, DOC, or DOCX file up to 10 MB.",
            );
            setSubmitting(false);
            return;
          }

          const blob = await upload(
            buildSlipBlobPath("admin-manual", file.name),
            file,
            {
              access: "private",
              contentType: file.type || undefined,
              handleUploadUrl: "/api/admin/student/slip-upload",
              onUploadProgress: ({ percentage }) => {
                setUploadProgress(Math.round(percentage));
              },
            },
          );

          uploadedSlip = {
            pathname: blob.pathname,
            url: blob.url,
            size: file.size,
            contentType: file.type || null,
          };
        }
      }

      const response = await fetch("/api/admin/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          uploaded_slip: uploadedSlip,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
        errors?: FieldErrors;
        primaryStudentId?: number | null;
      } | null;

      if (!response.ok) {
        setFieldErrors(payload?.errors ?? {});
        setFormError(payload?.message ?? adminCopy.create.error);
        setSubmitting(false);
        return;
      }

      const studentId = payload?.primaryStudentId;
      startTransition(() => {
        router.push(
          studentId
            ? `/cca-admin-area/student/${studentId}?created=1`
            : "/cca-admin-area/dashboard",
        );
        router.refresh();
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : adminCopy.create.error,
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 xl:grid-cols-[1.3fr_0.85fr]"
    >
      <div className="space-y-6">
        {allErrors.length > 0 ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
            <p>{formError ?? "Please correct the highlighted fields."}</p>
            <ul className="mt-3 space-y-1 text-xs font-bold text-rose-700">
              {allErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <Section title={adminCopy.create.sections.student}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name *" error={fieldErrors.full_name?.[0]}>
              <input
                value={values.full_name}
                onChange={(event) => update("full_name", event.target.value)}
                className={inputClass(fieldErrors.full_name?.[0])}
              />
            </Field>
            <Field
              label="Name With Initials *"
              error={fieldErrors.name_with_initials?.[0]}
            >
              <input
                value={values.name_with_initials}
                onChange={(event) =>
                  update("name_with_initials", event.target.value)
                }
                className={inputClass(fieldErrors.name_with_initials?.[0])}
              />
            </Field>
            <Field label="Gender *" error={fieldErrors.gender?.[0]}>
              <select
                value={values.gender}
                onChange={(event) =>
                  update("gender", event.target.value as "male" | "female")
                }
                className={selectClass(fieldErrors.gender?.[0])}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>
            <Field
              label="Date of Birth *"
              error={fieldErrors.date_of_birth?.[0]}
            >
              <input
                type="date"
                value={values.date_of_birth}
                onChange={(event) =>
                  update("date_of_birth", event.target.value)
                }
                className={inputClass(fieldErrors.date_of_birth?.[0])}
              />
            </Field>
            <Field
              label="NIC *"
              error={fieldErrors.nic?.[0]}
              helper={nicStatus?.message}
              helperTone={nicStatus?.valid ? "success" : "default"}
            >
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
            <Field
              label="WhatsApp Number *"
              error={fieldErrors.whatsapp_number?.[0]}
            >
              <input
                value={values.whatsapp_number}
                onChange={(event) =>
                  update("whatsapp_number", event.target.value)
                }
                className={inputClass(fieldErrors.whatsapp_number?.[0])}
              />
            </Field>
            <Field
              label="Emergency Contact Number *"
              error={fieldErrors.home_contact_number?.[0]}
            >
              <input
                value={values.home_contact_number}
                onChange={(event) =>
                  update("home_contact_number", event.target.value)
                }
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
              label="Permanent Address *"
              error={fieldErrors.permanent_address?.[0]}
              className="sm:col-span-2"
            >
              <textarea
                value={values.permanent_address}
                onChange={(event) =>
                  update("permanent_address", event.target.value)
                }
                rows={5}
                className={inputClass(fieldErrors.permanent_address?.[0])}
              />
            </Field>
          </div>
        </Section>

        <Section title={adminCopy.create.sections.registration}>
          <Field
            label={adminCopy.create.bootcamps.label}
            error={fieldErrors.selected_bootcamps?.[0]}
            helper={adminCopy.create.bootcamps.helper}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {bootcamps.map((bootcamp) => {
                const checked = values.selected_bootcamps.includes(bootcamp);
                const disabled =
                  !checked && values.selected_bootcamps.length >= 2;

                return (
                  <label
                    key={bootcamp}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-[1.25rem] border p-4 transition-all",
                      checked
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg shadow-neutral-900/10"
                        : "border-neutral-200 bg-white hover:border-neutral-900",
                      disabled && "cursor-not-allowed opacity-45",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleBootcamp(bootcamp)}
                      className="mt-1 h-4 w-4 rounded border-neutral-300"
                    />
                    <span className="text-sm font-bold leading-6">{bootcamp}</span>
                  </label>
                );
              })}
            </div>
          </Field>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              label={adminCopy.create.paymentSetup.label}
              error={fieldErrors.payment_setup?.[0]}
              helper={adminCopy.create.paymentSetup.helper}
            >
              <select
                value={values.payment_setup}
                onChange={(event) =>
                  update(
                    "payment_setup",
                    event.target.value as FormValues["payment_setup"],
                  )
                }
                className={selectClass(fieldErrors.payment_setup?.[0])}
              >
                <option value="online_completed">
                  {adminCopy.create.paymentSetup.options.online_completed}
                </option>
                <option value="slip_pending">
                  {adminCopy.create.paymentSetup.options.slip_pending}
                </option>
                <option value="slip_approved">
                  {adminCopy.create.paymentSetup.options.slip_approved}
                </option>
                <option value="study_now_pay_later">
                  {adminCopy.create.paymentSetup.options.study_now_pay_later}
                </option>
              </select>
            </Field>

            <ReadonlyCard
              label="What gets created"
              value={`${Math.max(values.selected_bootcamps.length, 1)} row${
                values.selected_bootcamps.length === 1 ? "" : "s"
              } in one registration group`}
            />
          </div>

          {isSlipPayment ? (
            <div className="mt-5 rounded-[1.5rem] border border-neutral-200 bg-white p-5">
              <Field
                label="Slip File"
                helper="Optional. Upload it now if you want this manual record to carry the actual bank slip."
              >
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center transition-all hover:border-neutral-900 hover:bg-white">
                  <span className="text-sm font-black text-neutral-900">
                    Upload bank slip
                  </span>
                  <span className="mt-2 text-xs font-medium text-neutral-500">
                    JPG, PNG, PDF, DOC, DOCX up to 10 MB
                  </span>
                  <input
                    name="payment_slip"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.docx,.doc"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        setSelectedSlipLabel(null);
                        return;
                      }

                      setSelectedSlipLabel(
                        `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`,
                      );
                    }}
                  />
                </label>
                {selectedSlipLabel ? (
                  <p className="text-xs font-semibold text-emerald-700">
                    {selectedSlipLabel}
                  </p>
                ) : null}
              </Field>
            </div>
          ) : null}
        </Section>

        {formError && allErrors.length === 0 ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
            {formError}
          </div>
        ) : null}

        {submitting && uploadProgress !== null ? (
          <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50 px-5 py-4 text-sm font-semibold text-sky-800">
            <div className="flex items-center justify-between gap-3">
              <span>Uploading slip securely</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-sky-100">
              <div
                className="h-full rounded-full bg-sky-600 transition-[width] duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 border-t border-neutral-100 pt-6 sm:flex sm:flex-wrap sm:items-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/10 disabled:opacity-60 sm:w-auto"
          >
            {submitting ? adminCopy.create.saving : adminCopy.create.save}
          </button>
          <button
            type="button"
            onClick={() => router.push("/cca-admin-area/dashboard")}
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-neutral-200 bg-white px-6 py-3.5 text-sm font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900 hover:bg-neutral-50 sm:w-auto"
          >
            {adminCopy.create.back}
          </button>
        </div>
      </div>

      <aside className="space-y-6">
        <Section title={adminCopy.create.sections.notes}>
          <div className="space-y-3">
            {adminCopy.create.notes.map((note) => (
              <div
                key={note}
                className="rounded-[1.25rem] border border-neutral-100 bg-neutral-50/70 px-4 py-4 text-sm font-medium leading-6 text-neutral-600"
              >
                {note}
              </div>
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
      <h2 className="text-2xl font-black tracking-tight text-neutral-900">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  error,
  helper,
  helperTone = "default",
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  helper?: string;
  helperTone?: "default" | "success";
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-semibold text-rose-600">{error}</p>
      ) : helper ? (
        <p
          className={cn(
            "text-xs font-medium",
            helperTone === "success" ? "text-emerald-600" : "text-neutral-500",
          )}
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function ReadonlyCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-neutral-100 bg-white px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-bold text-neutral-900">
        {value}
      </p>
    </div>
  );
}

function inputClass(hasError?: string) {
  return cn(
    "w-full rounded-2xl border-2 bg-white px-5 py-4 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:outline-none",
    hasError
      ? "border-rose-200 focus:border-rose-500"
      : "border-neutral-100 focus:border-neutral-900",
  );
}

function selectClass(hasError?: string) {
  return cn(
    inputClass(hasError),
    "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12",
  );
}
