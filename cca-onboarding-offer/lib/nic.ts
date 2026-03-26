import { digitsOnly } from "@/lib/utils";

type NicValidationResult = {
  valid: boolean;
  message?: string;
};

export function validateSriLankanNic(rawValue: string): NicValidationResult {
  const value = rawValue.trim();
  const oldFormat = /^[0-9]{9}[vVxX]$/;
  const newFormat = /^[0-9]{12}$/;

  if (!oldFormat.test(value) && !newFormat.test(value)) {
    return {
      valid: false,
      message: "Invalid NIC format. Use either 9 digits + V/X or 12 digits.",
    };
  }

  const now = new Date();
  const currentYear = now.getFullYear();

  let birthYear = 0;
  let dayOfYear = 0;

  if (oldFormat.test(value)) {
    birthYear = 1900 + Number(value.slice(0, 2));
    dayOfYear = Number(value.slice(2, 5));
  } else {
    const digits = digitsOnly(value);
    birthYear = Number(digits.slice(0, 4));
    dayOfYear = Number(digits.slice(4, 7));
  }

  if (dayOfYear > 500) {
    dayOfYear -= 500;
  }

  if (dayOfYear < 1 || dayOfYear > 366) {
    return { valid: false, message: "Invalid day of year in NIC." };
  }

  if (birthYear < 1900 || birthYear > currentYear - 10) {
    return { valid: false, message: "Invalid birth year in NIC." };
  }

  return { valid: true, message: "✓ Valid Sri Lankan NIC" };
}

export function normalizeNic(value: string) {
  return value.trim().toUpperCase();
}
