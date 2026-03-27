function fallbackValue(key: string, fallback: string) {
  const value = process.env[key];
  if (value && value.length > 0) {
    return value;
  }
  return fallback;
}

function resolveAppUrl() {
  const appUrl = process.env.APP_URL;
  if (appUrl && appUrl.length > 0) {
    return appUrl;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl && vercelUrl.length > 0) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export const env = {
  appUrl: resolveAppUrl(),
  adminUsername: fallbackValue("ADMIN_USERNAME", "admin@sitc.local"),
  adminPassword: fallbackValue("ADMIN_PASSWORD", "password123"),
  countdownDeadline: fallbackValue(
    "COUNTDOWN_DEADLINE",
    "2026-12-31T23:59:59+05:30",
  ),
  sessionSecret: fallbackValue(
    "SESSION_SECRET",
    "local-development-session-secret-change-me",
  ),
  payhereMerchantId: process.env.PAYHERE_MERCHANT_ID ?? "",
  payhereMerchantSecret: process.env.PAYHERE_MERCHANT_SECRET ?? "",
  payhereAppId: process.env.PAYHERE_APP_ID ?? "",
  payhereAppSecret: process.env.PAYHERE_APP_SECRET ?? "",
  payhereSandbox: (process.env.PAYHERE_SANDBOX ?? "true") === "true",
  smsUsername: process.env.SMS_USERNAME ?? "",
  smsPassword: process.env.SMS_PASSWORD ?? "",
  smsSource: process.env.SMS_SOURCE ?? "",
  smsApiUrl: process.env.SMS_API_URL ?? "",
};
