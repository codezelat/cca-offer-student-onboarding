"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { adminCopy } from "@/lib/content/admin";

type FormState = {
  email: string;
  password: string;
};

export function AdminLoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.message ?? adminCopy.login.invalidCredentials);
      setSubmitting(false);
      return;
    }

    startTransition(() => {
      router.push("/cca-admin-area/dashboard");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-900">
          {adminCopy.login.fields.email}
        </span>
        <input
          type="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-900">
          {adminCopy.login.fields.password}
        </span>
        <input
          type="password"
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {adminCopy.login.submit}
      </button>
    </form>
  );
}
