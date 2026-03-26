import path from "node:path";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { readSlipFile } from "@/lib/storage";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ studentId: string }> },
) {
  const session = await getSession();
  if (!session.admin_logged_in) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { studentId } = await context.params;
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
  });

  if (!student?.payment_slip) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readSlipFile(student.payment_slip);
    const extension = path.extname(student.payment_slip).slice(1).toLowerCase();
    return new Response(file, {
      headers: {
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
        "Content-Disposition": `inline; filename="${student.payment_slip}"`,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
