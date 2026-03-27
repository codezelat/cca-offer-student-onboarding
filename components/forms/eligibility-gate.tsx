"use client";

import Link from "next/link";
import { useState } from "react";

import { publicCopy } from "@/lib/content/public";
import { cn } from "@/lib/utils";

type EligibilityGateProps = {
  bootcamps: string[];
};

export function EligibilityGate({ bootcamps }: EligibilityGateProps) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const selectedBootcamps = bootcamps.join(" හෝ ");
  const bootcampQuery = encodeURIComponent(bootcamps.join(","));

  return (
    <div className="space-y-8">
      <div className="shadow-premium overflow-hidden rounded-[2.5rem] border border-neutral-100 bg-white p-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">
          {publicCopy.eligibility.eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
          {publicCopy.eligibility.title}
        </h1>
        <div className="mt-8 space-y-4">
          <p className="text-xl font-medium leading-relaxed text-neutral-800">
            මාර්තු 22 ආරම්භ කළ <span className="font-black italic text-neutral-900">{selectedBootcamps}</span>{" "}
            {publicCopy.eligibility.questionSuffix}
          </p>
          <p className="text-base font-medium leading-7 text-neutral-500">
            {publicCopy.eligibility.subtitle}
          </p>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setAnswer("yes")}
            className={cn(
              "rounded-full border-2 px-10 py-4 text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98]",
              answer === "yes" 
                ? "border-neutral-900 bg-neutral-900 text-white" 
                : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300"
            )}
          >
            {publicCopy.eligibility.yes}
          </button>
          <button
            type="button"
            onClick={() => setAnswer("no")}
            className={cn(
              "rounded-full border-2 px-10 py-4 text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98]",
              answer === "no"
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
            )}
          >
            {publicCopy.eligibility.no}
          </button>
        </div>
      </div>

      {answer === "yes" ? (
        <div className="animate-in fade-in slide-in-from-top-4 rounded-[2.5rem] border border-amber-100 bg-amber-50/50 p-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-amber-950 uppercase">
              {publicCopy.eligibility.yesCardTitle}
            </h2>
          </div>
          <p className="mt-6 text-base font-medium leading-relaxed text-amber-900">
            {publicCopy.eligibility.yesCardBody}
          </p>
          <div className="mt-8 rounded-3xl border border-amber-200 bg-white/60 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-amber-950">
              {publicCopy.eligibility.yesCardNext}
            </h3>
            <p className="mt-3 text-sm font-medium leading-6 text-amber-900/80">
              {publicCopy.eligibility.yesCardNextBody}
            </p>
          </div>
        </div>
      ) : null}

      {answer === "no" ? (
        <div className="animate-in fade-in slide-in-from-top-4 rounded-[2.5rem] border border-emerald-100 bg-emerald-50/50 p-10 shadow-sm">
           <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-emerald-950 uppercase">
              {publicCopy.eligibility.noCardTitle}
            </h2>
          </div>
          <p className="mt-6 text-base font-medium leading-relaxed text-emerald-900">
            {publicCopy.eligibility.noCardBody}
          </p>
          <Link
            href={`/register?bootcamp=${bootcampQuery}`}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-neutral-900 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-neutral-900/20 transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            {publicCopy.eligibility.noCardCta}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
