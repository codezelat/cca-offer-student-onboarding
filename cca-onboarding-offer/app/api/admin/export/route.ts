import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { getSession } from "@/lib/session";
import { getDashboardStudents } from "@/lib/student-service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session.admin_logged_in) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const result = await getDashboardStudents({
    search: url.searchParams.get("search") || undefined,
    diploma: url.searchParams.get("diploma") || undefined,
    payment_method: url.searchParams.get("payment_method") || undefined,
    page: 1,
    perPage: 5000,
  });

  const rows = [
    [
      "Registration ID",
      "Full Name",
      "Name with Initials",
      "Gender",
      "NIC",
      "Date of Birth",
      "Email",
      "WhatsApp Number",
      "Home Contact",
      "Permanent Address",
      "Postal Code",
      "District",
      "Selected Diploma",
      "Payment Method",
      "Amount Paid",
      "Payment Date",
      "Payment Slip URL",
    ],
    ...result.students.map((student) => [
      student.registration_id,
      student.full_name,
      student.name_with_initials,
      student.gender,
      student.nic,
      student.date_of_birth.toISOString().slice(0, 10),
      student.email,
      student.whatsapp_number,
      student.home_contact_number,
      student.permanent_address,
      student.postal_code ?? "",
      student.district,
      student.selected_diploma,
      student.payment_method ?? "",
      student.amount_paid?.toString() ?? "",
      student.payment_date?.toISOString() ?? "",
      student.payment_slip
        ? new URL(`/files/slips/${student.id}`, request.url).toString()
        : "",
    ]),
  ];

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);

  rows[0].forEach((_, index) => {
    const address = XLSX.utils.encode_cell({ c: index, r: 0 });
    if (!sheet[address]) {
      return;
    }
    sheet[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "667EEA" } },
    };
  });

  result.students.forEach((student, index) => {
    if (!student.payment_slip) {
      return;
    }
    const cellAddress = XLSX.utils.encode_cell({ c: 16, r: index + 1 });
    if (!sheet[cellAddress]) {
      return;
    }
    sheet[cellAddress].l = {
      Target: new URL(`/files/slips/${student.id}`, request.url).toString(),
      Tooltip: "Payment Slip URL",
    };
  });

  sheet["!cols"] = Array.from({ length: 18 }, () => ({ wch: 26 }));

  XLSX.utils.book_append_sheet(workbook, sheet, "Students");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="sitc-students.xlsx"',
    },
  });
}
