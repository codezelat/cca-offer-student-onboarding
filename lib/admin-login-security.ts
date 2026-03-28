import { createHash, timingSafeEqual } from "node:crypto";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS_PER_IP = 10;
const MAX_FAILED_ATTEMPTS_PER_EMAIL = 5;

function hashValue(value: string) {
  return createHash("sha256")
    .update(`${env.sessionSecret}:${value}`)
    .digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getClientIpHash(request: Request) {
  return hashValue(getClientIp(request));
}

function getEmailHash(email: string) {
  const normalized = normalizeEmail(email);
  return normalized ? hashValue(normalized) : null;
}

export function validateAdminCredentials(email: string, password: string) {
  const providedEmail = createHash("sha256").update(normalizeEmail(email)).digest();
  const expectedEmail = createHash("sha256").update(normalizeEmail(env.adminUsername)).digest();
  const providedPassword = createHash("sha256").update(password).digest();
  const expectedPassword = createHash("sha256").update(env.adminPassword).digest();

  return (
    timingSafeEqual(providedEmail, expectedEmail) &&
    timingSafeEqual(providedPassword, expectedPassword)
  );
}

export async function isAdminLoginRateLimited(request: Request, email: string) {
  const cutoff = new Date(Date.now() - ADMIN_LOGIN_WINDOW_MS);
  const ipHash = getClientIpHash(request);
  const emailHash = getEmailHash(email);

  const [failedIpAttempts, failedEmailAttempts] = await Promise.all([
    prisma.adminLoginAttempt.count({
      where: {
        ip_hash: ipHash,
        success: false,
        created_at: { gte: cutoff },
      },
    }),
    emailHash
      ? prisma.adminLoginAttempt.count({
          where: {
            email_hash: emailHash,
            success: false,
            created_at: { gte: cutoff },
          },
        })
      : Promise.resolve(0),
  ]);

  return (
    failedIpAttempts >= MAX_FAILED_ATTEMPTS_PER_IP ||
    failedEmailAttempts >= MAX_FAILED_ATTEMPTS_PER_EMAIL
  );
}

export async function recordAdminLoginAttempt(input: {
  request: Request;
  email: string;
  success: boolean;
  reason: string;
}) {
  await prisma.adminLoginAttempt.create({
    data: {
      ip_hash: getClientIpHash(input.request),
      email_hash: getEmailHash(input.email),
      success: input.success,
      reason: input.reason,
    },
  });
}
