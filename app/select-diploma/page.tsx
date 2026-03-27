import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { DiplomaSelectionForm } from "@/components/forms/diploma-selection-form";
import { diplomas, getDeadline } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";

export default function SelectDiplomaPage() {
  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-2xl space-y-10 py-8 px-2">
        
        <section className="w-full">
          <CountdownCard
            deadline={getDeadline()}
            label={publicCopy.countdown.label}
            title={publicCopy.countdown.title}
            subtitle={publicCopy.selectDiploma.support}
          />
        </section>

        <section className="w-full text-center space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            {publicCopy.selectDiploma.title}
          </h1>
          <p className="text-lg leading-8 text-neutral-600">
            {publicCopy.selectDiploma.subtitle}
          </p>
        </section>

        <section className="w-full p-8 rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
          <DiplomaSelectionForm
            diplomas={diplomas}
            cta={publicCopy.selectDiploma.cta}
          />
        </section>

      </div>
    </PublicShell>
  );
}
