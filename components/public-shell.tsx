import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

type PublicShellProps = {
  children: ReactNode;
  wide?: boolean;
};

export function PublicShell({ children, wide = false }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <SiteHeader />
      <main
        className={cn(
          "mx-auto w-full flex-grow px-4 py-12 sm:px-6 lg:px-8",
          wide ? "max-w-7xl" : "max-w-4xl", // reduced max-w for better reading length on minimal UI
        )}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
