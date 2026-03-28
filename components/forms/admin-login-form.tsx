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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-2xl border-2 border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700 animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      ) : null}
      <label className="block">
        <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-4">
          {adminCopy.login.fields.email}
        </span>
        <input
          type="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-black text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all"
        />
      </label>
      <label className="block">
        <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-4">
          {adminCopy.login.fields.password}
        </span>
        <input
          type="password"
          value={values.password}
          placeholder="••••••••"
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-black text-neutral-900 shadow-sm focus:outline-none focus:border-neutral-900 transition-all"
        />
      </label>
      <div className="pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-neutral-900 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-neutral-900/20 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-40"
        >
          {submitting ? "Verifying Access..." : adminCopy.login.submit}
        </button>
      </div>
    </form>
  );
}
