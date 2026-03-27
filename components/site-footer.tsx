import Image from "next/image";
import Link from "next/link";
import { supportContact } from "@/lib/config";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="flex flex-col items-center gap-6 md:items-start">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logo-set-line-sub.png"
                alt="CCA and SITC Logos"
                width={300}
                height={60}
                className="h-10 w-auto opacity-90 transition-opacity hover:opacity-100"
              />
            </Link>
            <p className="max-w-xs text-center text-sm leading-6 text-neutral-500 md:text-left">
              Empowering the next generation of tech leaders through industry-aligned bootcamps and specialized training.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:gap-24">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
                Support & Contact
              </h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li>
                  <a href={`tel:${supportContact.phone.replace(/\s+/g, "")}`} className="hover:text-neutral-900">
                    {supportContact.phone}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${supportContact.whatsapp.replace(/\D/g, "")}`} className="hover:text-neutral-900">
                    WhatsApp Support
                  </a>
                </li>
                <li>
                  <a href={`mailto:${supportContact.email}`} className="hover:text-neutral-900">
                    {supportContact.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
                Quick Links
              </h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li>
                  <a href="https://codezela.com" target="_blank" rel="noreferrer" className="hover:text-neutral-900">
                    Codezela Technologies
                  </a>
                </li>
                <li>
                  <a href="https://sitc.lk" target="_blank" rel="noreferrer" className="hover:text-neutral-900">
                    SITC Campus
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-100 pt-8">
          <p className="text-center text-xs text-neutral-400">
            © {currentYear} CCA Campus. All rights reserved. Powered by Codezela Technologies.
          </p>
        </div>
      </div>
    </footer>
  );
}
