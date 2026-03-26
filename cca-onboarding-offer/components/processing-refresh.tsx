"use client";

import { useEffect, useState } from "react";

export function ProcessingRefresh() {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.location.reload();
          return 5;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return <span>{seconds}s...</span>;
}
