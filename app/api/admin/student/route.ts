import { NextResponse } from "next/server";
import { Prisma } from "@/generated/postgres/client";

import { getSession } from "@/lib/session";
import { createAdminStudentRecords } from "@/lib/student-service";
import { validateAdminCreateInput } from "@/lib/validation";

export const runtime = "nodejs";

async function ensureAdmin() {
  const session = await getSession();
  return Boolean(session.admin_logged_in);
}

export async function POST(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = validateAdminCreateInput(body);

    if (!validated.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validated.errors },
        { status: 422 },
      );
    }

    const students = await createAdminStudentRecords(validated.data);

    return NextResponse.json({
      success: true,
      students,
      primaryStudentId: students[0]?.id ?? null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_CONFLICT") {
      const duplicateErrors =
        "errors" in error && typeof error.errors === "object" && error.errors
          ? error.errors
          : undefined;

      return NextResponse.json(
        {
          message: "This student is already registered for one of the selected bootcamps.",
          errors: duplicateErrors,
        },
        { status: 409 },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message: "This student conflicts with another existing record.",
        },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Unable to create student record." },
      { status: 500 },
    );
  }
}
