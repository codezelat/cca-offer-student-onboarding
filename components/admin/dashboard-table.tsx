"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

export function DashboardTable({ students }: DashboardTableProps) {
  const router = useRouter();
  const [deleteStudent, setDeleteStudent] = useState<DashboardStudent | null>(null);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const formatted = useMemo(
    () =>
      students.map((student) => ({
        ...student,
        amount_paid: student.amount_paid ?? "",
      })),
    [students],
  );

  async function handleDelete() {
    if (!deleteStudent || deleteText !== "DELETE") {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError(null);

      const response = await fetch(`/api/admin/student/${deleteStudent.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? adminCopy.dashboard.delete.error);
      }

      setDeleteStudent(null);
      setDeleteText("");
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : adminCopy.dashboard.delete.error,
      );
    } finally {
      setDeleting(false);
    }
  }

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
            {formatted.map((student) => (
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
                  {student.payment_method === "online" ? (
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-full border shadow-sm ${
                        student.payment_status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full shadow-inner ${student.payment_status === "completed" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {student.payment_status === "completed"
                        ? adminCopy.dashboard.status.success
                        : adminCopy.dashboard.status.pending}
                    </span>
                  ) : student.payment_slip ? (
                    <a
                      href={`/files/slips/${student.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-indigo-700 border border-indigo-100 shadow-sm transition-all hover:bg-indigo-100"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {adminCopy.dashboard.status.viewSlip}
                    </a>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      {adminCopy.dashboard.status.noSlip}
                    </span>
                  )}
                </td>
                <td className="px-6 py-6 text-sm">
                  <div className="flex items-center gap-3">
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
                      onClick={() => {
                        setDeleteStudent(student);
                        setDeleteText("");
                        setDeleteError(null);
                      }}
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
            ))}
          </tbody>
        </table>
      </div>

      {deleteStudent ? (
        <Modal onClose={() => setDeleteStudent(null)}>
          <div className="flex items-center justify-between border-b border-neutral-100 pb-8">
            <h2 className="text-3xl font-black text-neutral-900 uppercase italic">
              {adminCopy.dashboard.delete.title}
            </h2>
            <button onClick={() => setDeleteStudent(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-900 hover:text-white transition-colors">
              ✕
            </button>
          </div>
          <div className="mt-10 p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100">
            <p className="text-lg font-bold text-rose-950 leading-relaxed">
              {adminCopy.dashboard.delete.body.replace(
                "{name}",
                deleteStudent.full_name,
              )}
            </p>
            <p className="mt-4 text-sm font-medium text-rose-800/70">
              {adminCopy.dashboard.delete.warning}
            </p>
          </div>
          {deleteError ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
              {deleteError}
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
              onClick={() => setDeleteStudent(null)}
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
        </Modal>
      ) : null}
    </>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-neutral-200 bg-white p-10 shadow-2xl shadow-neutral-950/10 animate-in zoom-in-95 duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
