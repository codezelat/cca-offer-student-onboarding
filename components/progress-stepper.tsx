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
    <div className="shadow-card overflow-hidden rounded-[2rem] border border-neutral-200 bg-white/90 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between px-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
            {title}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-900">
            {step}
          </h2>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {labels.map((label, index) => {
          const active = index + 1 <= current;
          const isCurrent = index + 1 === current;
          return (
            <div
              key={label}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-2xl border-2 px-4 py-6 transition-all",
                isCurrent 
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-xl shadow-neutral-900/10"
                  : active
                    ? "border-emerald-100 bg-emerald-50 text-emerald-900"
                    : "border-neutral-100 bg-neutral-50 text-neutral-400 opacity-60",
              )}
            >
              <div className={cn(
                "text-[10px] font-black uppercase tracking-[0.25em]",
                isCurrent ? "text-neutral-400" : active ? "text-emerald-500" : "text-neutral-300"
              )}>
                {index + 1}
              </div>
              <div className="mt-2 text-xs font-black uppercase tracking-tight sm:text-sm">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
