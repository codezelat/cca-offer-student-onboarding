"use client";

import Link from "next/link";
import { useState } from "react";

import { publicCopy } from "@/lib/content/public";

type EligibilityGateProps = {
  bootcamps: string[];
};

export function EligibilityGate({ bootcamps }: EligibilityGateProps) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const selectedBootcamps = bootcamps.join(" හෝ ");
  const bootcampQuery = encodeURIComponent(bootcamps.join(","));

  return (
    <div className="space-y-6">
      <div className="shadow-card rounded-[2rem] border border-slate-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
          {publicCopy.eligibility.eyebrow}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {publicCopy.eligibility.title}
        </h1>
        <p className="mt-6 text-xl leading-8 text-slate-800">
          මාර්තු 22 ආරම්භ කළ {selectedBootcamps}{" "}
          {publicCopy.eligibility.questionSuffix}
        </p>
        <p className="mt-3 text-base leading-7 text-slate-600">
          {publicCopy.eligibility.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setAnswer("yes")}
            className="rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-900"
          >
            {publicCopy.eligibility.yes}
          </button>
          <button
            type="button"
            onClick={() => setAnswer("no")}
            className="rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white"
          >
            {publicCopy.eligibility.no}
          </button>
        </div>
      </div>

      {answer === "yes" ? (
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-amber-950">
            {publicCopy.eligibility.yesCardTitle}
          </h2>
          <p className="mt-4 leading-7 text-amber-900">
            {publicCopy.eligibility.yesCardBody}
          </p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-white/70 p-5">
            <h3 className="text-lg font-semibold text-amber-950">
              {publicCopy.eligibility.yesCardNext}
            </h3>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              {publicCopy.eligibility.yesCardNextBody}
            </p>
          </div>
        </div>
      ) : null}

      {answer === "no" ? (
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-emerald-950">
            {publicCopy.eligibility.noCardTitle}
          </h2>
          <p className="mt-4 leading-7 text-emerald-900">
            {publicCopy.eligibility.noCardBody}
          </p>
          <Link
            href={`/register?bootcamp=${bootcampQuery}`}
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
          >
            {publicCopy.eligibility.noCardCta}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
