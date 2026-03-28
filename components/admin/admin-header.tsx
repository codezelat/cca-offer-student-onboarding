import Image from "next/image";
import Link from "next/link";

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  homeHref?: string;
};

export function AdminHeader({
  title,
  subtitle = "CCA admin area",
  action,
  homeHref = "/cca-admin-area/dashboard",
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <Link href={homeHref} className="inline-flex items-center">
            <Image
              src="/images/logo-set-for-head.png"
              alt="CCA and SITC Campus Logos"
              width={600}
              height={240}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>
          <div className="mt-3 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-neutral-400">
              Admin
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="truncate text-xl font-black tracking-tight text-neutral-900 sm:text-2xl">
                {title}
              </h1>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
              <p className="text-sm font-medium text-neutral-500">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">{action}</div>
      </div>
    </header>
  );
}
