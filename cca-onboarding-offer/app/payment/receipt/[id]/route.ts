import { readFile } from "node:fs/promises";
import path from "node:path";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { prisma } from "@/lib/db";
import { publicCopy } from "@/lib/content/public";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
  });

  if (!student || student.payment_method !== "online" || student.payment_status !== "completed") {
    return new Response("Not found", { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([419.53, 595.28]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logoPath = path.join(process.cwd(), "public", "images", "sitc-logo.png");
  const logoBytes = await readFile(logoPath);
  const logo = await pdf.embedPng(logoBytes);
  const scaledLogo = logo.scale(0.18);

  page.drawRectangle({
    x: 24,
    y: 24,
    width: 371.53,
    height: 547.28,
    borderColor: rgb(0.23, 0.51, 0.96),
    borderWidth: 2,
  });

  page.drawImage(logo, {
    x: 40,
    y: 500,
    width: scaledLogo.width,
    height: scaledLogo.height,
  });

  page.drawText(publicCopy.receipt.title, {
    x: 40,
    y: 470,
    size: 18,
    font: bold,
    color: rgb(0.06, 0.09, 0.16),
  });

  const lines = [
    [publicCopy.receipt.labels.registrationId, student.registration_id],
    [publicCopy.receipt.labels.fullName, student.full_name],
    [publicCopy.receipt.labels.nic, student.nic],
    [publicCopy.receipt.labels.email, student.email],
    [publicCopy.receipt.labels.contact, student.whatsapp_number],
    [publicCopy.receipt.labels.selectedProgram, student.selected_diploma],
    [
      publicCopy.receipt.labels.paymentMethod,
      publicCopy.receipt.labels.paymentMethodValue,
    ],
    [
      publicCopy.receipt.labels.paymentStatus,
      publicCopy.receipt.labels.paymentStatusValue,
    ],
    [
      publicCopy.receipt.labels.paymentDate,
      student.payment_date?.toISOString() ?? "",
    ],
  ];

  let y = 430;
  lines.forEach(([label, value]) => {
    page.drawText(label, {
      x: 40,
      y,
      size: 11,
      font: bold,
      color: rgb(0.2, 0.23, 0.29),
    });
    page.drawText(value, {
      x: 170,
      y,
      size: 11,
      font,
      color: rgb(0.06, 0.09, 0.16),
      maxWidth: 200,
    });
    y -= 28;
  });

  page.drawText(publicCopy.receipt.footer, {
    x: 40,
    y: 50,
    size: 10,
    font,
    color: rgb(0.39, 0.45, 0.55),
    maxWidth: 320,
  });

  const bytes = Buffer.from(await pdf.save());

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="receipt-${student.registration_id}.pdf"`,
    },
  });
}
