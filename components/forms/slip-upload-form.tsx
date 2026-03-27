"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlipUploadField } from "./slip-upload-field";
import { publicCopy } from "@/lib/content/public";
import { toast } from "@/lib/toast";

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
    } catch (err) {
      const msg = "Unable to submit. Please check your connection and try again.";
      setError(msg);
      toast.error(msg);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-xs font-bold text-rose-900 uppercase tracking-widest">{error}</p>
          </div>
        </div>
      )}
      
      <div>
        <label className="mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1">
          {publicCopy.uploadSlip.uploadField}
        </label>
        <div className="rounded-[2.5rem] bg-white border-2 border-neutral-100 p-2 overflow-hidden hover:border-neutral-900 transition-all hover:shadow-premium group">
          <SlipUploadField />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-neutral-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex justify-center rounded-full bg-neutral-900 px-10 py-5 text-sm font-black text-white shadow-xl shadow-neutral-900/10 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? "Uploading..." : publicCopy.uploadSlip.submit}
        </button>
        <a
          href="/payment/options"
          className="w-full sm:w-auto inline-flex justify-center rounded-full border-2 border-neutral-200 bg-white px-10 py-5 text-sm font-black text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
        >
          {publicCopy.uploadSlip.back}
        </a>
      </div>
    </form>
  );
}
