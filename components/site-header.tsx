import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  admin?: boolean;
  title?: string;
  action?: React.ReactNode;
};

export function SiteHeader({ admin = false, title, action }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70">
      <div className="glass-effect mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/sitc-logo.png"
            alt="SITC Campus"
            width={380}
            height={128}
            className={cn("h-14 w-auto", admin && "h-12")}
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          {title ? (
            <div className="hidden text-right md:block">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                {title}
              </p>
            </div>
          ) : null}
          {action}
        </div>
      </div>
    </header>
  );
}
