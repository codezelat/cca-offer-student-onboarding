import { redirect } from "next/navigation";

import { CountdownCard } from "@/components/countdown-card";
import { ProgressStepper } from "@/components/progress-stepper";
import { PublicShell } from "@/components/public-shell";
import { RegisterForm } from "@/components/forms/register-form";
import { getDeadline, getDiplomaByName } from "@/lib/config";
import { prisma } from "@/lib/db";
import { publicCopy } from "@/lib/content/public";
import { generateRegistrationId } from "@/lib/ids";

type Props = {
  searchParams: Promise<{ diploma?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const { diploma } = await searchParams;
  const selectedDiploma = getDiplomaByName(diploma ?? null);

  if (!selectedDiploma) {
    redirect("/select-diploma");
  }

  const registrationId = await generateRegistrationId(
    prisma,
    selectedDiploma.full_name,
  );

  return (
    <PublicShell wide>
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <ProgressStepper
            title={publicCopy.register.progressTitle}
            step={publicCopy.register.step}
            labels={publicCopy.register.steps}
            current={1}
          />
          <CountdownCard
            deadline={getDeadline()}
            title={publicCopy.countdown.title}
            subtitle={publicCopy.countdown.subtitle}
            shortLabels
          />
        </div>
        <RegisterForm
          diploma={selectedDiploma.full_name}
          registrationId={registrationId}
          courseLink={selectedDiploma.course_link}
        />
      </div>
    </PublicShell>
  );
}
