"use client";

import { useEffect } from "react";

export function RegistrationSessionCleaner() {
  useEffect(() => {
    void fetch("/api/payment/session/clear", {
      method: "POST",
    });
  }, []);

  return null;
}
