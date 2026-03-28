function requireValue(key: string) {
  const value = process.env[key];
  if (value && value.length > 0) {
    return value;
  }

  throw new Error(`Missing required environment variable: ${key}`);
}

function optionalValue(key: string) {
  return process.env[key]?.trim() ?? "";
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
  adminUsername: requireValue("ADMIN_USERNAME"),
  adminPassword: requireValue("ADMIN_PASSWORD"),
  countdownDeadline: requireValue("COUNTDOWN_DEADLINE"),
  sessionSecret: requireValue("SESSION_SECRET"),
  databaseUrl: requireValue("DATABASE_URL"),
  payhereMerchantId: optionalValue("PAYHERE_MERCHANT_ID"),
  payhereMerchantSecret: optionalValue("PAYHERE_MERCHANT_SECRET"),
  payhereSandbox: (process.env.PAYHERE_SANDBOX ?? "true") === "true",
  smsUsername: optionalValue("SMS_USERNAME"),
  smsPassword: optionalValue("SMS_PASSWORD"),
  smsSource: optionalValue("SMS_SOURCE"),
  smsApiUrl: optionalValue("SMS_API_URL"),
};
