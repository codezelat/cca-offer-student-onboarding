const allowedSlipExtensions = ["jpg", "jpeg", "png", "pdf", "docx", "doc"] as const;

export const ALLOWED_SLIP_EXTENSIONS = new Set<string>(allowedSlipExtensions);
export const ALLOWED_SLIP_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
] as const;
export const MAX_SLIP_FILE_SIZE = 10 * 1024 * 1024;
export const SLIP_BLOB_PREFIX = "payment-slips";

export function getSlipFileExtension(filename: string) {
  const trimmed = filename.trim();
  const lastDot = trimmed.lastIndexOf(".");

  if (lastDot === -1 || lastDot === trimmed.length - 1) {
    return "";
  }

  return trimmed.slice(lastDot + 1).toLowerCase();
}

export function sanitizePathSegment(value: string) {
  return value
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function isAllowedSlipFile(input: {
  filename: string;
  size: number;
  contentType?: string | null;
}) {
  const extension = getSlipFileExtension(input.filename);
  if (!ALLOWED_SLIP_EXTENSIONS.has(extension)) {
    return false;
  }

  if (input.size > MAX_SLIP_FILE_SIZE) {
    return false;
  }

  if (
    input.contentType &&
    !ALLOWED_SLIP_CONTENT_TYPES.includes(
      input.contentType as (typeof ALLOWED_SLIP_CONTENT_TYPES)[number],
    )
  ) {
    return false;
  }

  return true;
}

export function buildSlipBlobPath(registrationId: string, filename: string) {
  const extension = getSlipFileExtension(filename);
  const safeRegistrationId = sanitizePathSegment(registrationId) || "registration";
  const safeBaseName =
    sanitizePathSegment(filename.replace(/\.[^.]+$/, "")) || "payment-slip";
  const suffix = typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`;

  return `${SLIP_BLOB_PREFIX}/${safeRegistrationId}/${safeBaseName}-${suffix}.${extension}`;
}
