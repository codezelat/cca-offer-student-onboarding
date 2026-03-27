"use client";

import { useEffect } from "react";

type ReceiptDownloadTriggerProps = {
  href: string;
};

export function ReceiptDownloadTrigger({ href }: ReceiptDownloadTriggerProps) {
  useEffect(() => {
    const link = document.createElement("a");
    link.href = href;
    link.rel = "noreferrer";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [href]);

  return null;
}
