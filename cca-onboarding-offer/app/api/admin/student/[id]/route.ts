import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { removeSlipFile } from "@/lib/storage";
import { updateStudentRecord } from "@/lib/student-service";
import { adminUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

async function ensureAdmin() {
  const session = await getSession();
  if (!session.admin_logged_in) {
    return false;
  }
  return true;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
  });

  if (!student) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = adminUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const student = await updateStudentRecord(Number(id), parsed.data);
    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to update student." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existing = await prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (existing.payment_slip) {
      await removeSlipFile(existing.payment_slip);
    }

    await prisma.student.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to delete student." }, { status: 500 });
  }
}
