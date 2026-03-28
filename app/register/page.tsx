import { redirect } from "next/navigation";

import { CountdownCard } from "@/components/countdown-card";
import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { RegisterForm } from "@/components/forms/register-form";
import { decodeBootcampQuery } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";
import { prisma } from "@/lib/db";
import { generateRegistrationId } from "@/lib/ids";
import { getDeadline } from "@/lib/server-config";

type Props = {
  searchParams: Promise<{ bootcamp?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const { bootcamp } = await searchParams;
  const selectedBootcamps = decodeBootcampQuery(bootcamp);

  if (selectedBootcamps.length === 0) {
    redirect("/select-bootcamp");
  }

  const registrationId = await generateRegistrationId(prisma);

  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-10 py-8 px-2">
        
        <div className="w-full space-y-8">
          <CountdownCard
            deadline={getDeadline()}
            title={publicCopy.countdown.title}
            subtitle={publicCopy.countdown.subtitle}
            shortLabels
          />
          <ProgressStepper
            title={publicCopy.register.progressTitle}
            step={publicCopy.register.step}
            labels={publicCopy.register.steps}
            current={1}
          />
        </div>

        <div className="w-full rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm">
          <RegisterForm
            bootcamps={selectedBootcamps}
            registrationId={registrationId}
          />
        </div>

      </div>
    </PublicShell>
  );
}
