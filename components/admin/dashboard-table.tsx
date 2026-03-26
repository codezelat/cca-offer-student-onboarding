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

const labelMap: Record<string, string> = {
  registration_id: "Registration ID",
  full_name: "Full Name",
  name_with_initials: "Name with Initials",
  selected_diploma: "Selected Diploma",
  nic: "NIC",
  whatsapp_number: "WhatsApp",
  email: "Email",
  district: "District",
  payment_method: "Payment Method",
  payment_status: "Payment Status",
  amount_paid: "Amount Paid",
};

export function DashboardTable({ students }: DashboardTableProps) {
  const router = useRouter();
  const [viewStudent, setViewStudent] = useState<DashboardStudent | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<DashboardStudent | null>(null);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

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

    setDeleting(true);
    await fetch(`/api/admin/student/${deleteStudent.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setDeleteStudent(null);
    setDeleteText("");
    router.refresh();
  }

  return (
    <>
      <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-card">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr>
              {adminCopy.dashboard.headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {formatted.map((student) => (
              <tr key={student.id}>
                <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                  {student.registration_id}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">{student.full_name}</td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  {student.selected_diploma}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">{student.nic}</td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  {student.whatsapp_number}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  {student.payment_method === "online" ? (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        student.payment_status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {student.payment_status === "completed"
                        ? adminCopy.dashboard.status.success
                        : adminCopy.dashboard.status.pending}
                    </span>
                  ) : student.payment_slip ? (
                    <a
                      href={`/files/slips/${student.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 underline"
                    >
                      {adminCopy.dashboard.status.viewSlip}
                    </a>
                  ) : (
                    adminCopy.dashboard.status.noSlip
                  )}
                </td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setViewStudent(student)}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-900"
                    >
                      View
                    </button>
                    <Link
                      href={`/sitc-admin-area/student/${student.id}/edit`}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-900"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteStudent(student)}
                      className="rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewStudent ? (
        <Modal onClose={() => setViewStudent(null)}>
          <h2 className="text-xl font-semibold text-slate-950">
            {adminCopy.dashboard.viewModalTitle}
          </h2>
          <dl className="mt-6 space-y-4">
            {Object.entries(viewStudent).map(([key, value]) => {
              if (!(key in labelMap)) {
                return null;
              }

              return (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {labelMap[key]}
                  </dt>
                  <dd className="mt-2 text-sm text-slate-900">{value || "-"}</dd>
                </div>
              );
            })}
          </dl>
        </Modal>
      ) : null}

      {deleteStudent ? (
        <Modal onClose={() => setDeleteStudent(null)}>
          <h2 className="text-xl font-semibold text-slate-950">
            {adminCopy.dashboard.delete.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            {adminCopy.dashboard.delete.body.replace(
              "{name}",
              deleteStudent.full_name,
            )}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {adminCopy.dashboard.delete.warning}
          </p>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-slate-900">
              {adminCopy.dashboard.delete.label}
            </span>
            <input
              value={deleteText}
              onChange={(event) => setDeleteText(event.target.value)}
              placeholder={adminCopy.dashboard.delete.placeholder}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />
          </label>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setDeleteStudent(null)}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900"
            >
              {adminCopy.dashboard.delete.cancel}
            </button>
            <button
              type="button"
              disabled={deleteText !== "DELETE" || deleting}
              onClick={() => void handleDelete()}
              className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
