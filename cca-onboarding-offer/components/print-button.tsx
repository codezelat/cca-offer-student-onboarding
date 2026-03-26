"use client";

type PrintButtonProps = {
  label: string;
  className?: string;
};

export function PrintButton({ label, className }: PrintButtonProps) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {label}
    </button>
  );
}
