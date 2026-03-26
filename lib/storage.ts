import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const storageRoot = path.join(process.cwd(), "storage", "payment_slips");

export async function ensureStorageRoot() {
  await mkdir(storageRoot, { recursive: true });
}

export function getStoragePath(filename: string) {
  return path.join(storageRoot, filename);
}

export async function saveSlipFile(filename: string, content: Buffer) {
  await ensureStorageRoot();
  const fullPath = getStoragePath(filename);
  await writeFile(fullPath, content);
  return fullPath;
}

export async function readSlipFile(filename: string) {
  const fullPath = getStoragePath(filename);
  return readFile(fullPath);
}

export async function removeSlipFile(filename: string | null | undefined) {
  if (!filename) {
    return;
  }

  const fullPath = getStoragePath(filename);
  try {
    await unlink(fullPath);
  } catch {
    return;
  }
}

export async function slipFileExists(filename: string) {
  try {
    await stat(getStoragePath(filename));
    return true;
  } catch {
    return false;
  }
}
