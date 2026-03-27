import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { BootcampSelectionForm } from "@/components/forms/bootcamp-selection-form";
import { bootcamps } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { getDeadline } from "@/lib/server-config";

export default function SelectBootcampPage() {
  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-12 py-8 px-2">
        <section className="w-full">
          <CountdownCard
            deadline={getDeadline()}
            label={publicCopy.countdown.label}
            title={publicCopy.countdown.title}
          />
        </section>

        <section className="w-full text-center space-y-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            {publicCopy.selectBootcamp.title}
          </h1>
          <div className="mx-auto max-w-xl text-lg leading-8 text-neutral-600">
            <p>{publicCopy.selectBootcamp.subtitle}</p>
          </div>
        </section>

        <section className="w-full">
          <BootcampSelectionForm
            bootcamps={bootcamps}
            cta={publicCopy.selectBootcamp.cta}
          />
        </section>
      </div>
    </PublicShell>
  );
}
