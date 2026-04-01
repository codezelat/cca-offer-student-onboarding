import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import {
  ALLOWED_SLIP_CONTENT_TYPES,
  ALLOWED_SLIP_EXTENSIONS,
  MAX_SLIP_FILE_SIZE,
  SLIP_BLOB_PREFIX,
  getSlipFileExtension,
} from "@/lib/slip-files";

export const runtime = "nodejs";

async function ensureAdmin() {
  const session = await getSession();
  return Boolean(session.admin_logged_in);
}

export async function POST(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(`${SLIP_BLOB_PREFIX}/admin-manual/`)) {
          throw new Error("INVALID_SLIP_UPLOAD_PATH");
        }

        const extension = getSlipFileExtension(pathname);
        if (!ALLOWED_SLIP_EXTENSIONS.has(extension)) {
          throw new Error("UNSUPPORTED_SLIP_TYPE");
        }

        return {
          allowedContentTypes: [...ALLOWED_SLIP_CONTENT_TYPES],
          maximumSizeInBytes: MAX_SLIP_FILE_SIZE,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({
            uploadScope: "admin-manual-slip",
          }),
        };
      },
      onUploadCompleted: async () => {
        return;
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to authorize upload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
