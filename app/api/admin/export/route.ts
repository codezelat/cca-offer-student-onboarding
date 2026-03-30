import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { getDashboardStudents } from "@/lib/student-service";
import { createWorkbookBuffer } from "@/lib/xlsx";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
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
        { value: "Registration ID" },
        { value: "Full Name" },
        { value: "Name with Initials" },
        { value: "Gender" },
        { value: "NIC" },
        { value: "Date of Birth" },
        { value: "Email" },
        { value: "WhatsApp Number" },
        { value: "Home Contact" },
        { value: "Permanent Address" },
        { value: "Postal Code" },
        { value: "District" },
        { value: "Selected Diploma" },
        { value: "Payment Method" },
        { value: "Amount Paid" },
        { value: "Payment Date" },
        { value: "Payment Slip URL" },
      ],
      ...result.students.map((student) => {
        const paymentSlipUrl = student.payment_slip
          ? new URL(`/files/slips/${student.id}`, request.url).toString()
          : "";

        return [
          { value: student.registration_id },
          { value: student.full_name },
          { value: student.name_with_initials },
          { value: student.gender },
          { value: student.nic },
          { value: student.date_of_birth.toISOString().slice(0, 10) },
          { value: student.email },
          { value: student.whatsapp_number },
          { value: student.home_contact_number },
          { value: student.permanent_address },
          { value: student.postal_code ?? "" },
          { value: student.district },
          { value: student.selected_diploma },
          { value: student.payment_method ?? "" },
          { value: student.amount_paid?.toString() ?? "" },
          { value: student.payment_date?.toISOString() ?? "" },
          paymentSlipUrl
            ? { value: paymentSlipUrl, hyperlink: paymentSlipUrl }
            : { value: "" },
        ];
      }),
    ];

    const buffer = await createWorkbookBuffer({
      rows,
      sheetName: "Students",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="cca-students.xlsx"',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Export failed." },
      { status: 500 },
    );
  }
}
