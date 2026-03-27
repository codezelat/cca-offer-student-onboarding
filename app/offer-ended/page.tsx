import { PublicShell } from "@/components/public-shell";
import { supportContact } from "@/lib/config";
import { publicCopy } from "@/lib/content/public";

export default function OfferEndedPage() {
  return (
    <PublicShell>
      <section className="rounded-[2.5rem] border border-rose-100 bg-rose-50/30 p-10 sm:p-14 shadow-premium">
        <div className="inline-flex rounded-full bg-rose-600 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-lg shadow-rose-600/20">
          {publicCopy.offerEnded.badge}
        </div>
        <h1 className="mt-8 text-balance text-6xl font-black tracking-tighter text-neutral-900 uppercase italic leading-[0.9]">
          {publicCopy.offerEnded.title}
        </h1>
        <p className="mt-6 text-xl font-bold leading-relaxed text-neutral-800">
          {publicCopy.offerEnded.subtitle}
        </p>
        <div className="mt-10 space-y-6 max-w-3xl">
          <p className="text-lg font-medium leading-relaxed text-neutral-500">
            {publicCopy.offerEnded.body}
          </p>
          <p className="text-lg font-medium leading-relaxed text-neutral-500">
            {publicCopy.offerEnded.bodyFollowup}
          </p>
        </div>

        <div className="mt-14 rounded-[2.5rem] border-2 border-white bg-white p-10 shadow-premium">
          <h2 className="text-3xl font-black text-neutral-900 uppercase italic">
            {publicCopy.offerEnded.whatsappTitle}
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-neutral-500">
            {publicCopy.offerEnded.whatsappBody}
          </p>
          <a
            href={`https://wa.me/${supportContact.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex rounded-full bg-neutral-900 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-neutral-900/10 transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            {publicCopy.offerEnded.whatsappCta}
          </a>
        </div>
        <p className="mt-12 text-xs font-black uppercase tracking-[0.2em] text-neutral-400">{publicCopy.offerEnded.footer}</p>
      </section>
    </PublicShell>
  );
}
