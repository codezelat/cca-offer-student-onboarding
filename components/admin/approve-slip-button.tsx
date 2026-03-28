"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { adminCopy } from "@/lib/content/admin";

type ApproveSlipButtonProps = {
  studentId: number;
  variant?: "icon" | "button";
};

export function ApproveSlipButton({
  studentId,
  variant = "button",
}: ApproveSlipButtonProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/admin/student/${studentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "approve-slip" }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? adminCopy.dashboard.approve.error);
      }

      router.refresh();
    } catch (approveError) {
      setError(
        approveError instanceof Error
          ? approveError.message
          : adminCopy.dashboard.approve.error,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          disabled={submitting}
          onClick={() => void handleApprove()}
          className="group flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 shadow-sm transition-all hover:bg-emerald-600 hover:text-white disabled:opacity-50"
          title={submitting ? adminCopy.dashboard.approve.working : adminCopy.dashboard.approve.action}
        >
          <svg
            className="h-4 w-4 text-emerald-600 group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}
      </>
    );
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        disabled={submitting}
        onClick={() => void handleApprove()}
        className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-500 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-600 disabled:opacity-50"
      >
        {submitting ? adminCopy.dashboard.approve.working : adminCopy.dashboard.approve.action}
      </button>
      {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  );
}
