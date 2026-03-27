import Image from "next/image";
import Link from "next/link";

import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { getDeadline } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";

export default function HomePage() {
  return (
    <PublicShell>
      <div className="flex flex-col items-center mx-auto max-w-3xl space-y-12 py-8 px-2">
        {/* Top Countdown */}
        <section className="w-full">
          <CountdownCard
            className="w-full"
            deadline={getDeadline()}
            label={publicCopy.countdown.label}
            title={publicCopy.countdown.title}
          />
        </section>

        {/* Header Section */}
        <section className="text-center space-y-8 flex flex-col items-center w-full">
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-neutral-900 sm:text-6xl md:text-7xl">
            {publicCopy.home.title}
          </h1>
          <p className="max-w-xl text-lg text-neutral-500">
            {publicCopy.home.subtitle}
          </p>
        </section>

        {/* Image Section */}
        <section className="w-full">
          <Image
            src="/images/convo-img.jpg"
            alt={publicCopy.home.imageAlt}
            width={1718}
            height={958}
            priority
            className="h-auto w-full object-cover rounded-[2rem] grayscale-[30%] contrast-125"
          />
        </section>

        {/* Propositions Section */}
        <section className="w-full space-y-10">
          <ol className="space-y-6">
            {publicCopy.home.propositions.map((lines, index) => (
              <li
                key={index}
                className="flex items-start gap-6 text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8 bg-neutral-50 p-6 rounded-3xl"
              >
                <span className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div className="pt-1.5">
                  <span>{lines[0]} </span>
                  {lines[1] ? (
                    <strong className="font-semibold text-neutral-900">
                      {lines[1]}
                    </strong>
                  ) : null}
                  {lines[2] ? <span> {lines[2]}</span> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA Section */}
        <section className="w-full flex flex-col items-center space-y-8 pb-12">
          <Link
            href="/select-diploma"
            className="inline-flex w-full max-w-xl rounded-full items-center justify-center bg-neutral-900 px-8 py-5 text-base font-semibold text-white transition-colors hover:bg-neutral-800 shadow-md"
          >
            {publicCopy.home.cta}
          </Link>
        </section>
      </div>
    </PublicShell>
  );
}
