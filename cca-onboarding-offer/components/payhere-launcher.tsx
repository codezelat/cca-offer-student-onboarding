"use client";

import Script from "next/script";

import { publicCopy } from "@/lib/content/public";
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
            window.alert("PayHere is not available right now.");
            return;
          }

          window.payhere.onCompleted = (orderId) => {
            window.location.href = `/payment/payhere-success?order_id=${encodeURIComponent(orderId)}`;
          };
          window.payhere.onDismissed = () => {
            window.alert(publicCopy.payhere.alerts.cancelled);
          };
          window.payhere.onError = (error) => {
            window.alert(publicCopy.payhere.alerts.failed.replace("{error}", error));
          };
          window.payhere.startPayment(payment);
        }}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-soft"
      >
        {publicCopy.payhere.ctaButton}
      </button>
    </>
  );
}
