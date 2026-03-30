"use client";

import { useState } from "react";

import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";

type StudentRecordDeleteButtonProps = {
  studentId: number;
  studentName: string;
};

export function StudentRecordDeleteButton({
  studentId,
  studentName,
}: StudentRecordDeleteButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-2.5 text-sm font-bold text-rose-700 transition-all hover:bg-rose-600 hover:text-white active:scale-[0.98]"
      >
        Delete Registration
      </button>

      {confirmOpen ? (
        <DeleteConfirmationModal
          studentId={studentId}
          studentName={studentName}
          onClose={() => setConfirmOpen(false)}
          redirectOnSuccess="/cca-admin-area/dashboard"
        />
      ) : null}
    </>
  );
}
