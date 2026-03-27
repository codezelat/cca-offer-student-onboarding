import type { Metadata } from "next";
import Script from "next/script";

import { Inter } from "next/font/google";
import { GOOGLE_ANALYTICS_ID } from "@/lib/config";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Student Registration",
    template: "%s | Student Registration",
  },
  description: "CCA Campus special offer student registration system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full bg-white antialiased ${inter.className}`}>
      <body className="min-h-full bg-white text-neutral-900">
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
        <ToastContainer />
      </body>
    </html>
  );
}
