"use client";

import { useId, useState } from "react";

import { publicCopy } from "@/lib/content/public";

export function SlipUploadField() {
  const id = useId();
  const [fileLabel, setFileLabel] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center"
      >
        <span className="text-sm font-semibold text-slate-900">
          {publicCopy.uploadSlip.uploadIdle[0]}
        </span>
        <span className="mt-2 text-sm text-slate-500">
          {publicCopy.uploadSlip.uploadIdle[1]}
        </span>
        <span className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
          {publicCopy.uploadSlip.uploadFormats}
        </span>
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
      {fileLabel ? <p className="text-sm text-slate-600">{fileLabel}</p> : null}
    </div>
  );
}
