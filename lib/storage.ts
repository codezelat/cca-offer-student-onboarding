import { del, get, head } from "@vercel/blob";

import {
  SLIP_BLOB_PREFIX,
  isSlipPathOwnedByRegistration,
  isAllowedSlipFile,
} from "@/lib/slip-files";

export type UploadedSlipReference = {
  pathname: string;
  url: string;
  size: number;
  contentType?: string | null;
};

export function isSlipBlobPath(pathname: string) {
  return pathname.startsWith(`${SLIP_BLOB_PREFIX}/`);
}

export async function validateUploadedSlip(
  reference: UploadedSlipReference,
  registrationId?: string,
) {
  if (!isSlipBlobPath(reference.pathname)) {
    throw new Error("INVALID_SLIP_PATH");
  }

  if (registrationId && !isSlipPathOwnedByRegistration(reference.pathname, registrationId)) {
    throw new Error("SLIP_REGISTRATION_MISMATCH");
  }

  const blob = await head(reference.url);

  if (blob.pathname !== reference.pathname) {
    throw new Error("SLIP_PATH_MISMATCH");
  }

  if (registrationId && !isSlipPathOwnedByRegistration(blob.pathname, registrationId)) {
    throw new Error("SLIP_REGISTRATION_MISMATCH");
  }

  if (
    !isAllowedSlipFile({
      filename: blob.pathname,
      size: blob.size,
      contentType: blob.contentType,
    })
  ) {
    throw new Error("INVALID_SLIP_FILE");
  }

  return blob;
}

export async function readSlipFile(pathname: string, ifNoneMatch?: string) {
  if (!isSlipBlobPath(pathname)) {
    return null;
  }

  return get(pathname, {
    access: "private",
    ifNoneMatch,
  });
}

export async function removeSlipFile(pathname: string | null | undefined) {
  if (!pathname || !isSlipBlobPath(pathname)) {
    return;
  }

  try {
    await del(pathname);
  } catch {
    return;
  }
}
