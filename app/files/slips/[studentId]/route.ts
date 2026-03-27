import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { readSlipFile } from "@/lib/storage";

export const runtime = "nodejs";

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
    const result = await readSlipFile(
      student.payment_slip,
      _request.headers.get("if-none-match") ?? undefined,
    );

    if (!result) {
      return new Response("Not found", { status: 404 });
    }

    if (result.statusCode === 304) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "private, no-cache",
        },
      });
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "application/octet-stream",
        "Content-Disposition": result.blob.contentDisposition,
        "X-Content-Type-Options": "nosniff",
        ETag: result.blob.etag,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
