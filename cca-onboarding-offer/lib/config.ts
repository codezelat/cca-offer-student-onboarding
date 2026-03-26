import { env } from "@/lib/env";
import type { BankAccount, DiplomaConfig } from "@/lib/types";

export const GOOGLE_ANALYTICS_ID = "G-DE6V243K8N";
export const SESSION_COOKIE_NAME = "sitc_offer_session";
export const REGISTRATION_FEE = 4000;
export const TOTAL_COURSE_FEE = 22000;
export const EXAM_FEE = 1000;

export const supportContact = {
  whatsapp: "+94715258653",
  phone: "+94 11 453 2139",
  email: "info@sitc.lk",
};

export const diplomas: DiplomaConfig[] = [
  {
    code: "EN",
    name: "Diploma in English",
    full_name: "Diploma in English",
    reg_prefix: "SITC/SC/2025/26B/EN",
    course_link: "https://example.com/sitc/diploma-in-english",
  },
  {
    code: "PC",
    name: "Diploma in Psychology and Counseling",
    full_name: "Diploma in Psychology and Counseling",
    reg_prefix: "SITC/SC/2025/26B/PC",
    course_link:
      "https://example.com/sitc/diploma-in-psychology-and-counseling",
  },
  {
    code: "IT",
    name: "Diploma in Information Technology",
    full_name: "Diploma in Information Technology",
    reg_prefix: "SITC/SC/2025/26B/IT",
    course_link:
      "https://example.com/sitc/diploma-in-information-technology",
  },
  {
    code: "HR",
    name: "Diploma in Human Resource Management",
    full_name: "Diploma in Human Resource Management",
    reg_prefix: "SITC/SC/2025/26B/HR",
    course_link:
      "https://example.com/sitc/diploma-in-human-resource-management",
  },
  {
    code: "BM",
    name: "Diploma in Business Management",
    full_name: "Diploma in Business Management",
    reg_prefix: "SITC/SC/2025/26B/BM",
    course_link:
      "https://example.com/sitc/diploma-in-business-management",
  },
];

export const districts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
] as const;

export const whatsappGroups: Record<string, string> = {
  "Diploma in English": "https://chat.whatsapp.com/PLACEHOLDER-ENGLISH",
  "Diploma in Psychology and Counseling":
    "https://chat.whatsapp.com/PLACEHOLDER-PSYCHOLOGY",
  "Diploma in Information Technology":
    "https://chat.whatsapp.com/PLACEHOLDER-IT",
  "Diploma in Human Resource Management":
    "https://chat.whatsapp.com/PLACEHOLDER-HR",
  "Diploma in Business Management":
    "https://chat.whatsapp.com/PLACEHOLDER-BM",
};

export const bankAccounts: BankAccount[] = [
  {
    bank: "Bank of Ceylon",
    accountNumber: "PLACEHOLDER-ACCOUNT-NUMBER",
    accountName: "SITC Campus",
    branch: "Main Branch",
  },
  {
    bank: "Sampath Bank",
    accountNumber: "PLACEHOLDER-ACCOUNT-NUMBER",
    accountName: "SITC Campus",
    branch: "Main Branch",
  },
  {
    bank: "Commercial Bank",
    accountNumber: "PLACEHOLDER-ACCOUNT-NUMBER",
    accountName: "SITC Campus",
    branch: "Main Branch",
  },
  {
    bank: "People’s Bank",
    accountNumber: "PLACEHOLDER-ACCOUNT-NUMBER",
    accountName: "SITC Campus",
    branch: "Main Branch",
  },
];

export function getDiplomaByName(name?: string | null) {
  if (!name) {
    return null;
  }

  return diplomas.find((diploma) => diploma.full_name === name) ?? null;
}

export function getWhatsAppGroupLink(diplomaName: string) {
  return whatsappGroups[diplomaName] ?? null;
}

export function getDeadline() {
  return env.countdownDeadline;
}
