"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { adminCopy } from "@/lib/content/admin";
import { buildSlipBlobPath, isAllowedSlipFile } from "@/lib/slip-files";

type AdminSlipUploadButtonProps = {
  studentId: number;
  variant?: "button" | "compact";
};

export function AdminSlipUploadButton({
  studentId,
  variant = "button",
}: AdminSlipUploadButtonProps) {
  const router = useRouter();
  const inputId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(file: File | null) {
    if (!file) {
      return;
    }

    if (
      !isAllowedSlipFile({
        filename: file.name,
        size: file.size,
        contentType: file.type || null,
      })
    ) {
      setError("Please upload a JPG, PNG, PDF, DOC, or DOCX file up to 10 MB.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const blob = await upload(buildSlipBlobPath("admin-manual", file.name), file, {
        access: "private",
        contentType: file.type || undefined,
        handleUploadUrl: "/api/admin/student/slip-upload",
      });

      const response = await fetch(`/api/admin/student/${studentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "attach-slip",
          uploaded_slip: {
            pathname: blob.pathname,
            url: blob.url,
            size: file.size,
            contentType: file.type || null,
          },
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? adminCopy.dashboard.uploadSlip.error);
      }

      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : adminCopy.dashboard.uploadSlip.error,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className={
          variant === "compact"
            ? "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[11px] font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900 hover:bg-neutral-50"
            : "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[11px] font-black uppercase tracking-widest text-neutral-900 transition-all hover:border-neutral-900 hover:bg-neutral-50"
        }
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {submitting
          ? adminCopy.dashboard.uploadSlip.working
          : adminCopy.dashboard.uploadSlip.action}
      </label>
      <input
        id={inputId}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,.docx,.doc"
        className="sr-only"
        onChange={(event) =>
          void handleFileChange(event.target.files?.[0] ?? null)
        }
      />
      {error ? (
        <p className="text-xs font-semibold text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}
