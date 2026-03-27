"use client";

import Script from "next/script";

import { publicCopy } from "@/lib/content/public";
import { toast } from "@/lib/toast";
import type { PayHerePayment } from "@/lib/types";

declare global {
  interface Window {
    payhere?: {
      onCompleted?: (orderId: string) => void;
      onDismissed?: () => void;
      onError?: (error: string) => void;
      startPayment: (payment: PayHerePayment) => void;
    };
  }
}

type PayHereLauncherProps = {
  payment: PayHerePayment;
};

export function PayHereLauncher({ payment }: PayHereLauncherProps) {
  return (
    <>
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="afterInteractive" />
      <button
        type="button"
        onClick={() => {
          if (!window.payhere) {
            toast.error("Payment gateway is temporarily unavailable. Please try again in a moment.");
            return;
          }

          window.payhere.onCompleted = (orderId) => {
            window.location.href = `/payment/payhere-success?order_id=${encodeURIComponent(orderId)}`;
          };
          window.payhere.onDismissed = () => {
            toast.info(publicCopy.payhere.alerts.cancelled);
          };
          window.payhere.onError = (error) => {
            toast.error(publicCopy.payhere.alerts.failed.replace("{error}", error));
          };
          window.payhere.startPayment(payment);
        }}
        className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
      >
        <span className="relative flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          {publicCopy.payhere.ctaButton}
        </span>
      </button>
    </>
  );
}
