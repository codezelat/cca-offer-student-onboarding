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
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <CountdownCard
          deadline={getDeadline()}
          label={publicCopy.countdown.label}
          title={publicCopy.countdown.title}
        />
        <EligibilityGate diploma={selectedDiploma.full_name} />
      </div>
    </PublicShell>
  );
}
