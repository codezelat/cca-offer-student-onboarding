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
        "bg-gradient-accent shadow-soft rounded-[2rem] border border-rose-100 p-6 text-slate-900",
        className,
      )}
    >
      {label ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
          {label}
        </p>
      ) : null}
      <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-5 grid grid-cols-4 gap-3">
        {values.map((value, index) => (
          <div
            key={labels[index]}
            className="rounded-2xl border border-white/70 bg-white/80 px-3 py-4 text-center shadow-card"
          >
            <div className="text-2xl font-bold tracking-tight sm:text-4xl">
              {`${value}`.padStart(2, "0")}
            </div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
              {labels[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
