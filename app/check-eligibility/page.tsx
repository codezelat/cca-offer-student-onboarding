import { redirect } from "next/navigation";

import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { EligibilityGate } from "@/components/forms/eligibility-gate";
import { decodeBootcampQuery, getDeadline, isValidBootcamp } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";

type Props = {
  searchParams: Promise<{ bootcamp?: string }>;
};

export default async function CheckEligibilityPage({ searchParams }: Props) {
  const { bootcamp } = await searchParams;
  const selectedBootcamps = decodeBootcampQuery(bootcamp);
  const valid =
    selectedBootcamps.length > 0 &&
    selectedBootcamps.length <= 2 &&
    selectedBootcamps.every((name) => isValidBootcamp(name));

  if (!valid) {
    redirect("/select-bootcamp");
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
          <EligibilityGate bootcamps={selectedBootcamps} />
        </section>

      </div>
    </PublicShell>
  );
}
