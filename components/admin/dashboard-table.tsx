"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ApproveSlipButton } from "@/components/admin/approve-slip-button";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";
import { adminCopy } from "@/lib/content/admin";

type DashboardStudent = {
  id: number;
  registration_id: string;
  full_name: string;
  name_with_initials: string;
  selected_diploma: string;
  nic: string;
  whatsapp_number: string;
  email: string;
  district: string;
  payment_method: string | null;
  payment_status: string;
  payment_slip: string | null;
  amount_paid: string | null;
};

type DashboardTableProps = {
  students: DashboardStudent[];
};

function paymentBadge(paymentMethod: string | null, paymentStatus: string) {
  if (paymentMethod === "online") {
    return {
      label:
        paymentStatus === "completed"
          ? adminCopy.dashboard.status.success
          : adminCopy.dashboard.status.pending,
      className:
        paymentStatus === "completed"
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-amber-50 text-amber-700 border-amber-100",
      dotClassName:
        paymentStatus === "completed" ? "bg-emerald-500" : "bg-amber-500",
    };
  }

  if (paymentMethod === "slip") {
    return {
      label:
        paymentStatus === "completed"
          ? adminCopy.dashboard.status.slipApproved
          : adminCopy.dashboard.status.slipPending,
      className:
        paymentStatus === "completed"
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-amber-50 text-amber-700 border-amber-100",
      dotClassName:
        paymentStatus === "completed" ? "bg-emerald-500" : "bg-amber-500",
    };
  }

  if (paymentMethod === "study_now_pay_later") {
    return {
      label: adminCopy.dashboard.status.studyNowPayLater,
      className: "bg-sky-50 text-sky-700 border-sky-100",
      dotClassName: "bg-sky-500",
    };
  }

  return {
    label: adminCopy.dashboard.status.notSet,
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dotClassName: "bg-neutral-400",
  };
}

export function DashboardTable({ students }: DashboardTableProps) {
  const [deleteStudent, setDeleteStudent] = useState<DashboardStudent | null>(null);

  const formatted = useMemo(
    () =>
      students.map((student) => ({
        ...student,
        amount_paid: student.amount_paid ?? "",
      })),
    [students],
  );

  return (
    <>
      <div className="overflow-x-auto rounded-[2.5rem] border border-neutral-100 bg-white shadow-premium">
        <table className="min-w-full divide-y divide-neutral-100 text-left">
          <thead className="bg-neutral-50/50">
            <tr>
              {adminCopy.dashboard.headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 bg-white">
            {formatted.map((student) => {
              const badge = paymentBadge(
                student.payment_method,
                student.payment_status,
              );

              return (
                <tr key={student.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-6 text-sm font-black text-neutral-900 tabular-nums">
                  {student.registration_id}
                </td>
                <td className="px-6 py-6 text-sm font-bold text-neutral-800">{student.full_name}</td>
                <td className="px-6 py-6 text-xs font-black uppercase tracking-widest text-neutral-500">
                  {student.selected_diploma}
                </td>
                <td className="px-6 py-6 text-sm font-medium text-neutral-600 tabular-nums">{student.nic}</td>
                <td className="px-6 py-6 text-sm font-medium text-neutral-600 tabular-nums">
                  {student.whatsapp_number}
                </td>
                <td className="px-6 py-6 text-sm">
                  <div className="space-y-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${badge.className}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full shadow-inner ${badge.dotClassName}`}
                      />
                      {badge.label}
                    </span>

                    {student.payment_slip ? (
                      <a
                        href={`/files/slips/${student.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-indigo-700 border border-indigo-100 shadow-sm transition-all hover:bg-indigo-100"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {adminCopy.dashboard.status.viewSlip}
                      </a>
                    ) : student.payment_method === "slip" ? (
                      <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        {adminCopy.dashboard.status.noSlip}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-6 py-6 text-sm">
                  <div className="flex items-center gap-3">
                    {student.payment_method === "slip" &&
                    student.payment_status === "pending" &&
                    student.payment_slip ? (
                      <ApproveSlipButton studentId={student.id} variant="icon" />
                    ) : null}
                    <Link
                      href={`/cca-admin-area/student/${student.id}`}
                      className="group flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:border-neutral-900 hover:text-neutral-900"
                      title="Open Student Record"
                    >
                      <svg className="h-4 w-4 text-neutral-500 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/cca-admin-area/student/${student.id}/edit`}
                      className="group flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:border-neutral-900 hover:text-neutral-900"
                      title="Edit Student"
                    >
                      <svg className="h-4 w-4 text-neutral-500 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteStudent(student)}
                      className="group flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 shadow-sm transition-all hover:bg-rose-600 hover:text-white"
                      title="Delete Student"
                    >
                      <svg className="h-4 w-4 text-rose-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {deleteStudent ? (
        <DeleteConfirmationModal
          studentId={deleteStudent.id}
          studentName={deleteStudent.full_name}
          onClose={() => setDeleteStudent(null)}
        />
      ) : null}
    </>
  );
}
