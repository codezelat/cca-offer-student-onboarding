import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { publicCopy } from "@/lib/content/public";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-full max-w-2xl bg-white border border-neutral-100 rounded-[2.5rem] p-12 shadow-premium animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 bg-neutral-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-neutral-900/20 rotate-3">
              <span className="text-white text-3xl font-black">404</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 mb-4 sm:text-5xl">
            {publicCopy.notFound.title}
          </h1>
          
          <p className="text-xl font-bold text-neutral-400 mb-8 uppercase tracking-widest">
            {publicCopy.notFound.subtitle}
          </p>
          
          <p className="text-lg text-neutral-500 leading-relaxed max-w-lg mx-auto mb-12">
            {publicCopy.notFound.body}
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-neutral-900 text-white px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-[0.2em] transition-all hover:bg-neutral-800 shadow-xl shadow-neutral-900/10 active:scale-[0.98]"
          >
            {publicCopy.notFound.cta}
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
