import { env } from "@/lib/env";

export const GOOGLE_ANALYTICS_ID = "G-DE6V243K8N";
export const SESSION_COOKIE_NAME = "sitc_offer_session";
export const REGISTRATION_FEE = 3000;
export const TOTAL_COURSE_FEE = 18000;

export const BOOTCAMP_REG_PREFIX = "CCA/BC/2026/03";

export const supportContact = {
  whatsapp: "+94 76 677 2923",
  phone: "+94 76 677 2923",
  email: "ca@codezela.com",
};
export const bootcamps = [
  "Software Engineer",
  "Full Stack Developer",
  "QA Engineer",
  "DevOps Engineer",
  "Cyber Security Engineer",
  "Data Analyst",
  "Data Engineer",
  "AI and ML Engineer",
  "UI UX Designer",
  "Graphic Designer",
  "Digital Marketing Specialist",
  "SEO AEO Specialist",
  "Business Analyst",
  "Project Manager",
] as const;

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

export const whatsappGroups = bootcamps.reduce((acc, bootcamp) => {
  acc[bootcamp] = `https://chat.whatsapp.com/PLACEHOLDER-${bootcamp.toUpperCase().replace(/\s+/g, "-")}`;
  return acc;
}, {} as Record<string, string>);

export const bankAccounts = [
  {
    bank: "Commercial Bank",
    accountNumber: "1000837856",
    accountName: "Codezela U K",
    branch: "Union Place",
  },
];

export function getWhatsAppGroupLink(bootcampName: string) {
  return whatsappGroups[bootcampName] ?? null;
}

export function isValidBootcamp(name: string) {
  return (bootcamps as readonly string[]).includes(name);
}

export function getDeadline() {
  return env.countdownDeadline;
}
