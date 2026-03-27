"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlipUploadField } from "./slip-upload-field";
import { publicCopy } from "@/lib/content/public";

export function SlipUploadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch("/api/payment/store-slip", {
        method: "POST",
        body: formData,
      });

      if (response.redirected) {
        router.push(response.url);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to upload slip");
      }

      const url = new URL(response.url);
      router.push(url.pathname + url.search);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Unable to submit. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}
      
      <div>
        <label className="mb-3 block text-sm font-semibold uppercase tracking-widest text-neutral-900 px-3">
          {publicCopy.uploadSlip.uploadField}
        </label>
        <div className="rounded-[2.5rem] bg-white border border-neutral-100 p-2 overflow-hidden hover:border-neutral-200 transition-all hover:shadow-premium">
          <SlipUploadField />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-neutral-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-neutral-900 px-10 py-5 text-sm font-bold text-white shadow-xl shadow-neutral-900/10 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? "Uploading..." : publicCopy.uploadSlip.submit}
        </button>
        <a
          href="/payment/options"
          className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-neutral-200 bg-white px-10 py-5 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
        >
          {publicCopy.uploadSlip.back}
        </a>
      </div>
    </form>
  );
}
