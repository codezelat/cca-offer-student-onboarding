import Image from "next/image";
import Link from "next/link";
import { supportContact } from "@/lib/config";
import { WhatsAppSupport } from "./whatsapp-support";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 text-center sm:px-6 lg:px-8">
        <WhatsAppSupport
          variant="footer"
          className="max-w-md shadow-sm lg:hidden"
        />

        <Link
          href="/"
          className="inline-flex items-center opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image
            src="/images/logo-set-line-sub.png"
            alt="CCA and SITC Logos"
            width={1200}
            height={200}
            className="h-26 w-auto opacity-90 transition-opacity hover:opacity-100 object-contain"
          />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-neutral-600">
          <a
            href={`tel:${supportContact.phone.replace(/\s+/g, "")}`}
            className="hover:text-neutral-900"
          >
            Call Support
          </a>
          <a
            href={`https://wa.me/${supportContact.whatsapp.replace(/\D/g, "")}`}
            className="hover:text-neutral-900"
          >
            WhatsApp Support
          </a>
          <a
            href={`mailto:${supportContact.email}`}
            className="hover:text-neutral-900"
          >
            Email Support
          </a>
          <a
            href="https://codezela.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neutral-900"
          >
            Visit Codezela
          </a>
          <a
            href="https://sitc.lk"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neutral-900"
          >
            Visit SITC Campus
          </a>
        </div>

        <p className="text-xs text-neutral-400">
          © {currentYear} CCA Education Programs brought to you by Codezela
          Technologies in partnership with SITC Campus{" "}
        </p>
      </div>
    </footer>
  );
}
