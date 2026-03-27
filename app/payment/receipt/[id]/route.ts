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

  if (!student) {
    return new Response("Not found", { status: 404 });
  }

  // Fetch all registered bootcamps for this student in this session to show all IDs
  const baseRegId = student.registration_id.split("-")[0];
  const allRecords = await prisma.student.findMany({
    where: {
      OR: [
        { registration_id: baseRegId },
        { registration_id: { startsWith: `${baseRegId}-` } },
      ],
    },
    orderBy: { registration_id: "asc" },
  });

  const bootcampNames = allRecords.map((r) => r.selected_diploma);
  const allRegIds = allRecords.map((r) => r.registration_id);

  // PDF Creation
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);

  // Load Logo
  const logoPath = path.join(process.cwd(), "public", "images", "logo-set-line-sub.png");
  try {
    const logoBytes = await readFile(logoPath);
    const logo = await pdfDoc.embedPng(logoBytes);
    const scaledLogo = logo.scale(0.35);
    page.drawImage(logo, {
      x: 50,
      y: 750,
      width: scaledLogo.width,
      height: scaledLogo.height,
    });
  } catch (e) {
    console.error("Error loading logo for PDF", e);
  }

  // Title
  page.drawText("OFFICIAL REGISTRATION RECEIPT", {
    x: 50,
    y: 720,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText("CCA Education Programs — Powered by Codezela", {
    x: 50,
    y: 700,
    size: 9,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Border Line
  page.drawLine({
    start: { x: 50, y: 685 },
    end: { x: 545, y: 685 },
    thickness: 1,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Registration ID Box
  page.drawRectangle({
    x: 50,
    y: 610,
    width: 495,
    height: 60,
    color: rgb(0.09, 0.09, 0.11),
    borderRadius: { x: 10, y: 10 },
  });
  page.drawText("ASSIGNED REGISTRATION ID(S)", {
    x: 70,
    y: 650,
    size: 8,
    font: boldFont,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText(allRegIds.join(", "), {
    x: 70,
    y: 625,
    size: 14,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // Section: Student Information
  page.drawText("STUDENT INFORMATION", {
    x: 50,
    y: 580,
    size: 9,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  const studentInfo = [
    ["Full Name:", student.full_name],
    ["NIC Number:", student.nic],
    ["Email Address:", student.email],
    ["WhatsApp:", student.whatsapp_number],
  ];

  let currentY = 560;
  studentInfo.forEach(([label, value]) => {
    page.drawText(label, { x: 50, y: currentY, size: 10, font: font, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(value || "N/A", { x: 150, y: currentY, size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
    currentY -= 20;
  });

  // Section: Program Summary
  currentY -= 20;
  page.drawText("PROGRAM SUMMARY", {
    x: 50,
    y: currentY,
    size: 9,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  currentY -= 20;
  page.drawRectangle({
    x: 50, y: currentY - ((bootcampNames.length + 1) * 25), 
    width: 495, 
    height: (bootcampNames.length + 1) * 25 + 5,
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 1,
  });

  let rowY = currentY - 20;
  bootcampNames.forEach((name) => {
    page.drawText(`${name} Registration`, { x: 70, y: rowY, size: 10, font: font });
    page.drawText("Rs. 3,000.00", { x: 450, y: rowY, size: 10, font: font, color: rgb(0.1, 0.1, 0.1) });
    rowY -= 25;
  });

  // Total
  page.drawRectangle({ x: 50, y: rowY + 5, width: 495, height: 25, color: rgb(0.96, 0.96, 0.96) });
  page.drawText("Total Fee Paid:", { x: 70, y: rowY + 12, size: 10, font: boldFont });
  page.drawText(`Rs. ${(3000 * bootcampNames.length).toLocaleString()}.00`, { x: 440, y: rowY + 12, size: 11, font: boldFont });

  // Status
  currentY = rowY - 40;
  page.drawRectangle({
    x: 50, y: currentY, width: 495, height: 40,
    color: rgb(0.92, 0.98, 0.95),
    borderRadius: { x: 5, y: 5 },
  });
  page.drawText("PAYMENT SUBMITTED", { x: 70, y: currentY + 15, size: 10, font: boldFont, color: rgb(0.04, 0.3, 0.15) });
  page.drawText(`via ${student.payment_method === 'online' ? 'PayHere Secure Gateway' : 'Bank Slip Verification'}`, { 
    x: 180, y: currentY + 15, size: 9, font: font, color: rgb(0.2, 0.5, 0.3) 
  });

  // Footer
  const footerText = "This is an official computer-generated digital receipt issued by CCA Campus and SITC Campus. No physical signature is required. For any inquiries, please contact our support at +94 76 677 2924.";
  page.drawText(footerText, {
    x: 50,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
    maxWidth: 495,
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${student.registration_id.replace(/\//g, "-")}.pdf"`,
    },
  });
}
