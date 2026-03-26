"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import type { DiplomaConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

type DiplomaSelectionFormProps = {
  diplomas: DiplomaConfig[];
  cta: string;
};

export function DiplomaSelectionForm({
  diplomas,
  cta,
}: DiplomaSelectionFormProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {diplomas.map((diploma) => {
          const active = selected === diploma.full_name;
          return (
            <button
              key={diploma.code}
              type="button"
              onClick={() => setSelected(diploma.full_name)}
              className={cn(
                "shadow-card flex items-center justify-between rounded-[1.75rem] border bg-white px-5 py-5 text-left",
                active
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 hover:border-blue-200 hover:bg-slate-50",
              )}
            >
              <div className="text-lg font-semibold text-slate-900">
                {diploma.full_name}
              </div>
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2",
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-transparent",
                )}
              >
                ✓
              </div>
            </button>
          );
        })}
      </div>
      {selected ? (
        <button
          type="button"
          onClick={() =>
            startTransition(() => {
              router.push(
                `/check-eligibility?diploma=${encodeURIComponent(selected)}`,
              );
            })
          }
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-soft sm:w-auto"
        >
          {cta}
        </button>
      ) : null}
    </div>
  );
}
