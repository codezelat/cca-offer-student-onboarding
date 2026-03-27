import Image from "next/image";
import Link from "next/link";

import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { publicCopy } from "@/lib/content/public";
import { getDeadline } from "@/lib/server-config";

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
            {publicCopy.home.propositions.map((text, index) => (
              <li
                key={index}
                className="flex items-start gap-6 text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8 bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100 transition-all hover:bg-white hover:shadow-premium"
              >
                <span className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-sm font-bold text-white shadow-lg shadow-neutral-900/10">
                  {index + 1}
                </span>
                <div className="pt-2">
                  {text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={i} className="font-bold text-neutral-900">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return <span key={i} className="font-medium">{part}</span>;
                  })}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA Section */}
        <section className="w-full flex flex-col items-center space-y-8 pb-12">
          <Link
            href="/select-bootcamp"
            className="inline-flex w-full max-w-xl rounded-2xl items-center justify-center bg-neutral-900 px-8 py-5 text-lg font-bold text-white transition-all hover:bg-neutral-800 shadow-xl shadow-neutral-900/10 active:scale-[0.98]"
          >
            {publicCopy.home.cta}
          </Link>
        </section>
      </div>
    </PublicShell>
  );
}
