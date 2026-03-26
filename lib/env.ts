function fallbackValue(key: string, fallback: string) {
  const value = process.env[key];
  if (value && value.length > 0) {
    return value;
  }
  return fallback;
}

export const env = {
  appUrl: fallbackValue("APP_URL", "http://localhost:3000"),
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
