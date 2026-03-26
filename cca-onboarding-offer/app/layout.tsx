import type { Metadata } from "next";
import Script from "next/script";

import { GOOGLE_ANALYTICS_ID } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Student Registration",
    template: "%s | Student Registration",
  },
  description: "SITC Campus special offer student registration system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-neutral-50 antialiased">
      <body className="min-h-full bg-neutral-50 font-sans text-slate-900">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
