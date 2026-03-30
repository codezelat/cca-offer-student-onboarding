"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminCopy } from "@/lib/content/admin";

type DeleteConfirmationModalProps = {
  studentName: string;
  studentId: number;
  onClose: () => void;
  onSuccess?: () => void;
  redirectOnSuccess?: string;
};

export function DeleteConfirmationModal({
  studentName,
  studentId,
  onClose,
  onSuccess,
  redirectOnSuccess,
}: DeleteConfirmationModalProps) {
  const router = useRouter();
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (deleteText !== "DELETE") {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(`/api/admin/student/${studentId}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? adminCopy.dashboard.delete.error);
      }

      onClose();

      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      }

      router.refresh();
      onSuccess?.();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : adminCopy.dashboard.delete.error,
      );
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-neutral-200 bg-white p-10 shadow-2xl shadow-neutral-950/10 animate-in zoom-in-95 duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-8">
          <h2 className="text-3xl font-black text-neutral-900 uppercase italic">
            {adminCopy.dashboard.delete.title}
          </h2>
          <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-900 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        <div className="mt-10 p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100">
          <p className="text-lg font-bold text-rose-950 leading-relaxed">
            {adminCopy.dashboard.delete.body.replace(
              "{name}",
              studentName,
            )}
          </p>
          <p className="mt-4 text-sm font-medium text-rose-800/70">
            {adminCopy.dashboard.delete.warning}
          </p>
        </div>
        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
            {error}
          </div>
        ) : null}
        <label className="mt-10 block">
          <span className="mb-4 block text-[10px] font-black uppercase tracking-widest text-neutral-400 px-2">
            {adminCopy.dashboard.delete.label}
          </span>
          <input
            value={deleteText}
            onChange={(event) => setDeleteText(event.target.value)}
            placeholder={adminCopy.dashboard.delete.placeholder}
            className="w-full rounded-[1.5rem] border-2 border-neutral-100 bg-white px-6 py-4 text-sm font-black focus:outline-none focus:border-rose-500 transition-all uppercase placeholder:normal-case"
          />
        </label>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border-2 border-neutral-200 bg-white py-5 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-50"
          >
            {adminCopy.dashboard.delete.cancel}
          </button>
          <button
            type="button"
            disabled={deleteText !== "DELETE" || deleting}
            onClick={() => void handleDelete()}
            className="flex-1 rounded-full bg-rose-600 py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-rose-600/20 transition-all hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adminCopy.dashboard.delete.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
