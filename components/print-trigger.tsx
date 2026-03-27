"use client";

import { useEffect } from "react";

export function PrintTrigger() {
  useEffect(() => {
    // Delay slightly to ensure fonts and images are ready for print
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
