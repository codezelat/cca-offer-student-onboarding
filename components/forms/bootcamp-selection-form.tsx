"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type BootcampSelectionFormProps = {
  bootcamps: readonly string[];
  cta: string;
};

export function BootcampSelectionForm({
  bootcamps,
  cta,
}: BootcampSelectionFormProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleBootcamp(bootcamp: string) {
    setSelected((current) => {
      if (current.includes(bootcamp)) {
        return current.filter((item) => item !== bootcamp);
      }

      if (current.length >= 2) {
        return current;
      }

      return [...current, bootcamp];
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {bootcamps.map((bootcamp) => {
          const active = selected.includes(bootcamp);
          return (
            <button
              key={bootcamp}
              type="button"
              onClick={() => toggleBootcamp(bootcamp)}
              className={cn(
                "group flex items-center justify-between rounded-[2rem] border-2 px-6 py-6 text-left transition-all active:scale-[0.99]",
                active
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-xl shadow-neutral-900/10"
                  : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm",
              )}
            >
              <div className="flex flex-col">
                <div className={cn(
                  "text-lg font-bold tracking-tight transition-colors",
                  active ? "text-white" : "text-neutral-900"
                )}>
                  {bootcamp}
                </div>
                <div className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors",
                  active ? "text-neutral-400" : "text-neutral-400"
                )}>
                  Professional Program
                </div>
              </div>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                  active
                    ? "border-white bg-white text-neutral-900"
                    : "border-neutral-200 bg-transparent text-transparent group-hover:border-neutral-300",
                )}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
      {selected.length > 0 ? (
        <div className="flex pt-6">
          <button
            type="button"
            onClick={() =>
              startTransition(() => {
                router.push(
                  `/check-eligibility?bootcamp=${encodeURIComponent(selected.join(","))}`,
                );
              })
            }
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-10 py-5 text-base font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/30 active:scale-[0.98] sm:w-auto"
          >
            {cta}
          </button>
        </div>
      ) : null}
    </div>
  );
}
