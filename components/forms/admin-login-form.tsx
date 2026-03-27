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
        <span className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-3">
          {adminCopy.login.fields.email}
        </span>
        <input
          type="email"
          value={values.email}
          placeholder="admin@codezela.com"
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors"
        />
      </label>
      <label className="block">
        <span className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-3">
          {adminCopy.login.fields.password}
        </span>
        <input
          type="password"
          value={values.password}
          placeholder="••••••••"
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium focus:outline-none focus:border-neutral-900 transition-colors"
        />
      </label>
      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-neutral-900 px-8 py-5 text-sm font-bold text-white shadow-xl shadow-neutral-900/20 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60"
        >
          {submitting ? "Verifying..." : adminCopy.login.submit}
        </button>
      </div>
    </form>
  );
}
