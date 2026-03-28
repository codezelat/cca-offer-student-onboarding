"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StudentRecordDeleteButtonProps = {
  studentId: number;
  studentName: string;
};

export function StudentRecordDeleteButton({
  studentId,
  studentName,
}: StudentRecordDeleteButtonProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (deleteText !== "DELETE") {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/admin/student/${studentId}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to delete this registration.");
      }

      router.push("/cca-admin-area/dashboard");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this registration.",
      );
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setConfirmOpen(true);
          setDeleteText("");
          setError(null);
        }}
        className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-2.5 text-sm font-bold text-rose-700 transition-all hover:bg-rose-600 hover:text-white active:scale-[0.98]"
      >
        Delete Registration
      </button>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 p-4 backdrop-blur-sm"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 border-b border-neutral-100 pb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase italic">
                  Delete Registration
                </h2>
                <p className="mt-2 text-sm font-medium text-neutral-500">
                  This removes the selected student and any related program records in the same registration group.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-rose-100 bg-rose-50 p-6">
              <p className="text-sm font-bold leading-7 text-rose-950">
                You are deleting <span className="font-black">{studentName}</span> and every program row under the same registration.
              </p>
              <p className="mt-3 text-sm font-medium text-rose-800/80">
                This also removes the linked payment slip if one exists. This action cannot be undone.
              </p>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
                {error}
              </div>
            ) : null}

            <label className="mt-8 block">
              <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Type DELETE to confirm
              </span>
              <input
                value={deleteText}
                onChange={(event) => setDeleteText(event.target.value)}
                placeholder="Type DELETE"
                className="w-full rounded-2xl border-2 border-neutral-100 bg-white px-5 py-4 text-sm font-black text-neutral-900 uppercase transition-all focus:border-rose-500 focus:outline-none"
              />
            </label>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-full border-2 border-neutral-200 bg-white py-4 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteText !== "DELETE" || submitting}
                onClick={() => void handleDelete()}
                className="flex-1 rounded-full bg-rose-600 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Deleting..." : "Delete Registration"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
