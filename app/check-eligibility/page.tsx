import { redirect } from "next/navigation";

import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { EligibilityGate } from "@/components/forms/eligibility-gate";
import { getDeadline, getDiplomaByName } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";

type Props = {
  searchParams: Promise<{ diploma?: string }>;
};

export default async function CheckEligibilityPage({ searchParams }: Props) {
  const { diploma } = await searchParams;
  const selectedDiploma = getDiplomaByName(diploma ?? null);

  if (!selectedDiploma) {
    redirect("/select-diploma");
  }

  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-2xl space-y-10 py-8 px-2">
        
        <section className="w-full">
          <CountdownCard
            deadline={getDeadline()}
            label={publicCopy.countdown.label}
            title={publicCopy.countdown.title}
          />
        </section>

        <section className="w-full">
          <EligibilityGate diploma={selectedDiploma.full_name} />
        </section>

      </div>
    </PublicShell>
  );
}
