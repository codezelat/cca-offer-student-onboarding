import { PublicShell } from "@/components/public-shell";
import { supportContact } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";

export default function OfferEndedPage() {
  return (
    <PublicShell>
      <section className="rounded-[2.75rem] border border-rose-200 bg-gradient-accent p-8 shadow-soft sm:p-12">
        <div className="inline-flex rounded-full bg-rose-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white">
          {publicCopy.offerEnded.badge}
        </div>
        <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          {publicCopy.offerEnded.title}
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-800">
          {publicCopy.offerEnded.subtitle}
        </p>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-700">
          {publicCopy.offerEnded.body}
        </p>
        <p className="mt-3 text-lg leading-8 text-slate-700">
          {publicCopy.offerEnded.bodyFollowup}
        </p>

        <div className="mt-10 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-slate-950">
            {publicCopy.offerEnded.whatsappTitle}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            {publicCopy.offerEnded.whatsappBody}
          </p>
          <a
            href={`https://wa.me/${supportContact.whatsapp.replace(/\D/g, "")}`}
            className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
          >
            {publicCopy.offerEnded.whatsappCta}
          </a>
        </div>
        <p className="mt-10 text-sm text-slate-600">{publicCopy.offerEnded.footer}</p>
      </section>
    </PublicShell>
  );
}
