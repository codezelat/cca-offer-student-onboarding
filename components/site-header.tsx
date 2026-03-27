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
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/logo-set-for-head.png"
            alt="CCA and SITC Campus Logos"
            width={600}
            height={240}
            className={cn("h-14 w-auto sm:h-16", admin && "h-10")}
            priority
          />
        </Link>
        <div className="flex items-center gap-6">
          {title ? (
            <div className="hidden text-right md:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
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
