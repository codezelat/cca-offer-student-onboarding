import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

type PublicShellProps = {
  children: ReactNode;
  wide?: boolean;
};

export function PublicShell({ children, wide = false }: PublicShellProps) {
  return (
    <div className="page-frame">
      <div className="page-content">
        <SiteHeader />
        <main
          className={cn(
            "mx-auto w-full px-4 py-8 sm:px-6 lg:px-8",
            wide ? "max-w-7xl" : "max-w-6xl",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
