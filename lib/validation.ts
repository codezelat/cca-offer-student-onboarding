import { z } from "zod";

import { bootcamps, districts, BOOTCAMP_REG_PREFIX } from "@/lib/config";
import { normalizeNic, validateSriLankanNic } from "@/lib/nic";
import type { FormErrors, ValidationResult } from "@/lib/types";

const validBootcampNames = new Set(bootcamps as readonly string[]);
const validDistricts = new Set(districts);

const fullNameRegex = /^[a-zA-Z\s]+$/;
const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
const postalCodeRegex = /^[0-9]{5}$/;
const homeContactRegex = /^0[0-9]{9}$/;
const whatsappRegex = /^07[0-9]{8}$/;
const registrationIdRegex = new RegExp(`^${BOOTCAMP_REG_PREFIX.replace(/\//g, "\\/")}\\/\\d{8}$`);

export const registrationSchema = z.object({
  registration_id: z
    .string()
    .min(1, "Please enter a registration ID.")
    .regex(
      registrationIdRegex,
      "Please enter a valid registration ID for the selected program.",
    ),
  full_name: z
    .string()
    .min(1, "Please enter your full name.")
    .max(255)
    .regex(fullNameRegex, "Full name should only contain letters and spaces."),
  name_with_initials: z
    .string()
    .min(1, "Please enter your name with initials.")
    .max(255),
  gender: z
    .string()
    .min(1, "Please select your gender.")
    .refine((value) => value === "male" || value === "female", {
      message: "Please select a valid gender option.",
    }),
  nic: z
    .string()
    .min(1, "Please enter your NIC number.")
    .regex(
      nicRegex,
      "Please enter a valid NIC number (e.g., 123456789V or 123456789012).",
    ),
  date_of_birth: z
    .string()
    .min(1, "Please enter a valid date of birth.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Please enter a valid date of birth.",
    })
    .refine((value) => new Date(value).getTime() < Date.now(), {
      message: "Date of birth must be in the past.",
    })
    .refine((value) => new Date(value).getTime() > new Date("1950-01-01").getTime(), {
      message: "Please enter a valid date of birth.",
    }),
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .max(255),
  permanent_address: z
    .string()
    .min(1, "Please enter your permanent address.")
    .max(500, "Address cannot exceed 500 characters."),
  postal_code: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || postalCodeRegex.test(value), {
      message: "Please enter a valid 5-digit postal code.",
    }),
  district: z
    .string()
    .min(1, "Please select your district.")
    .refine((value) => validDistricts.has(value as (typeof districts)[number]), {
      message: "Please select your district.",
    }),
  home_contact_number: z
    .string()
    .min(1, "Please enter your emergency contact number.")
    .regex(
      homeContactRegex,
      "Please enter a valid Sri Lankan mobile number (e.g., 0771234567).",
    ),
  whatsapp_number: z
    .string()
    .min(1, "Please enter your WhatsApp number.")
    .regex(
      whatsappRegex,
      "Please enter a valid Sri Lankan mobile number (e.g., 0771234567).",
    ),
  terms_accepted: z.boolean().refine((value) => value, {
    message: "You must accept the terms and conditions to proceed.",
  }),
  selected_bootcamps: z
    .array(z.string())
    .min(1, "Please select at least one bootcamp.")
    .max(2, "You can select up to two bootcamps only.")
    .refine((values) => values.every((v) => validBootcampNames.has(v)), {
      message: "Please select valid bootcamp options.",
    }),
});

export const adminUpdateSchema = z.object({
  full_name: z.string().min(1, "Please enter your full name.").max(255),
  name_with_initials: z.string().min(1, "Please enter your name with initials.").max(255),
  gender: z
    .string()
    .min(1, "Please select your gender.")
    .refine((value) => value === "male" || value === "female", {
      message: "Please select a valid gender option.",
    }),
  nic: z
    .string()
    .min(1, "Please enter your NIC number.")
    .regex(
      nicRegex,
      "Please enter a valid NIC number (e.g., 123456789V or 123456789012).",
    ),
  date_of_birth: z
    .string()
    .min(1, "Please enter a valid date of birth.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Please enter a valid date of birth.",
    }),
  whatsapp_number: z
    .string()
    .min(1, "Please enter your WhatsApp number.")
    .regex(
      whatsappRegex,
      "Please enter a valid Sri Lankan mobile number (e.g., 0771234567).",
    ),
  home_contact_number: z
    .string()
    .min(1, "Please enter your emergency contact number.")
    .regex(
      homeContactRegex,
      "Please enter a valid Sri Lankan contact number (e.g., 0112345678).",
    ),
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  permanent_address: z.string().optional().default(""),
  postal_code: z
    .string()
    .optional()
    .default("")
    .refine((value) => !value || postalCodeRegex.test(value), {
      message: "Please enter a valid 5-digit postal code.",
    }),
  district: z
    .string()
    .min(1, "Please select your district.")
    .refine((value) => validDistricts.has(value as (typeof districts)[number]), {
      message: "Please select a valid district.",
    }),
  selected_diploma: z
    .string()
    .min(1, "Please select a bootcamp.")
    .refine((value) => validBootcampNames.has(value), {
      message: "Please select a valid bootcamp.",
    }),
});

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export function zodErrorsToFieldErrors(error: z.ZodError): FormErrors {
  return error.flatten().fieldErrors as FormErrors;
}

export function validateRegistrationInput(input: unknown): ValidationResult<z.infer<typeof registrationSchema>> {
  const result = registrationSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      errors: zodErrorsToFieldErrors(result.error),
    };
  }

  const nicResult = validateSriLankanNic(result.data.nic);
  if (!nicResult.valid) {
    return {
      success: false,
      errors: { nic: ["Please enter a valid Sri Lankan NIC number."] },
    };
  }

  return {
    success: true,
    data: {
      ...result.data,
      nic: normalizeNic(result.data.nic),
      email: result.data.email.trim(),
      permanent_address: result.data.permanent_address.trim(),
      postal_code: result.data.postal_code?.trim() || undefined,
    },
  };
}
