import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { DiplomaSelectionForm } from "@/components/forms/diploma-selection-form";
import { diplomas, getDeadline } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";

export default function SelectDiplomaPage() {
  return (
    <PublicShell>
      <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <CountdownCard
          deadline={getDeadline()}
          label={publicCopy.countdown.label}
          title={publicCopy.countdown.title}
          subtitle={publicCopy.selectDiploma.support}
        />
        <section className="shadow-soft rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 sm:p-10">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {publicCopy.selectDiploma.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {publicCopy.selectDiploma.subtitle}
          </p>
          <div className="mt-8">
            <DiplomaSelectionForm
              diplomas={diplomas}
              cta={publicCopy.selectDiploma.cta}
            />
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
