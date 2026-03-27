"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ToastEventDetail, ToastType } from "@/lib/toast";

interface ToastItem extends ToastEventDetail {
  id: number;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastEventDetail>).detail;
      const id = Date.now();
      
      setToasts((prev) => [...prev, { ...detail, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, detail.duration || 5000);
    };

    window.addEventListener("app-toast", handleToast);
    return () => window.removeEventListener("app-toast", handleToast);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm sm:w-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}

function ToastItem({ message, type, id }: ToastItem) {
  const icons = {
    success: (
      <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colors = {
    success: "border-emerald-100 bg-white text-emerald-900 shadow-emerald-500/10",
    error: "border-rose-100 bg-white text-rose-900 shadow-rose-500/10",
    info: "border-blue-100 bg-white text-blue-900 shadow-blue-500/10",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-4 rounded-2xl border p-4 shadow-2xl animate-toast-in",
        colors[type]
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-bold leading-relaxed">{message}</p>
    </div>
  );
}
