import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getRegistrationGroupWhere } from "@/lib/registration-groups";
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

    const groupWhere = getRegistrationGroupWhere(existing.registration_id);
    const groupStudents = await prisma.student.findMany({
      where: groupWhere,
      select: {
        id: true,
        payment_slip: true,
      },
    });

    const slipToRemove =
      groupStudents.find((student) => student.payment_slip)?.payment_slip ??
      existing.payment_slip;

    if (slipToRemove) {
      await removeSlipFile(slipToRemove);
    }

    await prisma.student.deleteMany({
      where: groupWhere,
    });

    return NextResponse.json({ success: true, deletedCount: groupStudents.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to delete student." }, { status: 500 });
  }
}
