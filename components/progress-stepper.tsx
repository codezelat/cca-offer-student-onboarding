import { cn } from "@/lib/utils";

type ProgressStepperProps = {
  title: string;
  step: string;
  labels: string[];
  current: number;
};

export function ProgressStepper({
  title,
  step,
  labels,
  current,
}: ProgressStepperProps) {
  return (
    <div className="shadow-card rounded-[2rem] border border-slate-200/70 bg-white/90 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
            {title}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {step}
          </h2>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {labels.map((label, index) => {
          const active = index + 1 <= current;
          return (
            <div
              key={label}
              className={cn(
                "rounded-2xl border px-4 py-4 text-center shadow-sm",
                active
                  ? "border-blue-200 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-slate-50 text-slate-500",
              )}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.25em]">
                {index + 1}
              </div>
              <div className="mt-2 text-sm font-semibold sm:text-base">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
