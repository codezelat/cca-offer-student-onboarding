"use client";

import { useId, useState } from "react";

import { publicCopy } from "@/lib/content/public";

export function SlipUploadField() {
  const id = useId();
  const [fileLabel, setFileLabel] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <label
        htmlFor={id}
        className="group relative flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-neutral-200 bg-neutral-50 p-10 text-center transition-all hover:border-neutral-900 hover:bg-white"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-neutral-900 shadow-soft transition-transform group-hover:scale-110">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-base font-bold text-neutral-900">
            {publicCopy.uploadSlip.uploadIdle[0]}
          </p>
          <p className="text-sm text-neutral-500">
            {publicCopy.uploadSlip.uploadIdle[1]}
          </p>
        </div>
        <div className="mt-6 border-t border-neutral-200 pt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          {publicCopy.uploadSlip.uploadFormats}
        </div>
      </label>
      <input
        id={id}
        name="payment_slip"
        type="file"
        required
        accept=".jpg,.jpeg,.png,.pdf,.docx,.doc"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            setFileLabel(null);
            return;
          }
          setFileLabel(
            publicCopy.uploadSlip.uploadSelected
              .replace("{filename}", file.name)
              .replace("{size}", (file.size / 1024 / 1024).toFixed(2)),
          );
        }}
        className="sr-only"
      />
      {fileLabel ? (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 border border-emerald-100">
          <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {fileLabel}
        </div>
      ) : null}
    </div>
  );
}
