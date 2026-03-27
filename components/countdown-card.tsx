"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

function getRemaining(deadline: string) {
  const target = new Date(deadline).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  return {
    complete: diff === 0,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

type CountdownCardProps = {
  deadline: string;
  label?: string;
  title: string;
  subtitle?: string;
  shortLabels?: boolean;
  className?: string;
};

export function CountdownCard({
  deadline,
  label,
  title,
  subtitle,
  shortLabels = false,
  className,
}: CountdownCardProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(() => getRemaining(deadline));

  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = getRemaining(deadline);
      setRemaining(next);
      if (next.complete) {
        window.clearInterval(interval);
        router.replace("/offer-ended");
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [deadline, router]);

  const labels = useMemo(
    () => (shortLabels ? ["Days", "Hrs", "Min", "Sec"] : ["Days", "Hours", "Minutes", "Seconds"]),
    [shortLabels],
  );

  const values = [
    remaining.days,
    remaining.hours,
    remaining.minutes,
    remaining.seconds,
  ];

  return (
    <div
      className={cn(
        "rounded-[2rem] border-2 border-rose-500 bg-rose-600 p-6 sm:p-8 text-white shadow-xl shadow-rose-900/10",
        className,
      )}
    >
      {label ? (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-rose-200">
          {label}
        </p>
      ) : null}
      <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-rose-100">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-4 sm:gap-6">
        {values.map((value, index) => (
          <div
            key={labels[index]}
            className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-4 sm:w-24 border border-white/20 backdrop-blur-sm"
          >
            <div className="text-4xl font-bold tabular-nums tracking-tight sm:text-5xl" suppressHydrationWarning>
              {`${value}`.padStart(2, "0")}
            </div>
            <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-rose-200">
              {labels[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
