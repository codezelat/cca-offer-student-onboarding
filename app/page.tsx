import Image from "next/image";
import Link from "next/link";

import { CountdownCard } from "@/components/countdown-card";
import { PublicShell } from "@/components/public-shell";
import { getDeadline } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";

export default function HomePage() {
  return (
    <PublicShell wide>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="space-y-8">
          <CountdownCard
            deadline={getDeadline()}
            label={publicCopy.countdown.label}
            title={publicCopy.countdown.title}
          />
          <div className="shadow-soft rounded-[2.5rem] border border-white/80 bg-white/90 p-8 sm:p-10">
            <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-rose-600">
              {publicCopy.home.seal[0]} {publicCopy.home.seal[1]} {publicCopy.home.seal[2]}
            </div>
            <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              {publicCopy.home.title}
            </h1>
            <ol className="mt-8 space-y-5">
              {publicCopy.home.propositions.map((lines, index) => (
                <li
                  key={index}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-lg leading-8 text-slate-800"
                >
                  <span className="mr-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-base font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{lines[0]} </span>
                  {lines[1] ? (
                    <span className="font-semibold text-rose-600">{lines[1]}</span>
                  ) : null}
                  {lines[2] ? <span> {lines[2]}</span> : null}
                </li>
              ))}
            </ol>
            <Link
              href="/select-diploma"
              className="mt-8 inline-flex rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-soft"
            >
              {publicCopy.home.cta}
            </Link>
          </div>
        </section>
        <section className="relative">
          <div className="absolute -left-4 top-10 hidden rounded-full border border-rose-200 bg-rose-50 px-6 py-4 text-center text-sm font-semibold text-rose-600 shadow-card md:block">
            <div>{publicCopy.home.seal[0]}</div>
            <div>{publicCopy.home.seal[1]}</div>
            <div>{publicCopy.home.seal[2]}</div>
            <div>{publicCopy.home.seal[3]}</div>
          </div>
          <div className="overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/90 p-4 shadow-soft">
            <Image
              src="/images/convo-img.jpg"
              alt={publicCopy.home.imageAlt}
              width={1718}
              height={958}
              priority
              className="h-auto w-full rounded-[2rem] object-cover"
            />
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
