export const GOOGLE_ANALYTICS_ID = "G-DE6V243K8N";
export const SESSION_COOKIE_NAME = "sitc_offer_session";
export const REGISTRATION_FEE = 3000;

export const BOOTCAMP_REG_PREFIX = "CCA/BC/2026/03";

export const supportContact = {
  whatsapp: "+94 76 677 2923",
  phone: "+94 76 677 2923",
  email: "ca@codezela.com",
};

export const bootcampConfigs = [
  {
    name: "Software Engineer",
    whatsappGroup:
      "https://chat.whatsapp.com/KKLTiCw1fMpGtOjVWIEifZ?mode=gi_t",
  },
  {
    name: "Full Stack Developer",
    whatsappGroup:
      "https://chat.whatsapp.com/DPMEZAHICZKEi07qZ2Ssfo?mode=gi_t",
  },
  {
    name: "QA Engineer",
    whatsappGroup:
      "https://chat.whatsapp.com/Dxqw8RGYusU5hkyga7njGe?mode=gi_t",
  },
  {
    name: "DevOps Engineer",
    whatsappGroup:
      "https://chat.whatsapp.com/D0qPHuvf2Vu4P3bbuTUPMW?mode=gi_t",
  },
  {
    name: "Cyber Security Engineer",
    whatsappGroup:
      "https://chat.whatsapp.com/IOXz02zJARdD2AMn2ZyTF8?mode=gi_t",
  },
  {
    name: "Data Analyst",
    whatsappGroup:
      "https://chat.whatsapp.com/InD3zAExszCKmFfhGfyyoB?mode=gi_t",
  },
  {
    name: "Data Engineer",
    whatsappGroup:
      "https://chat.whatsapp.com/FS1ZWKaaT9tGpX08Dtj1x0?mode=gi_t",
  },
  {
    name: "AI and ML Engineer",
    whatsappGroup:
      "https://chat.whatsapp.com/KGBSoMJNgr5FcHIXfmx96i?mode=gi_t",
  },
  {
    name: "UI UX Designer",
    whatsappGroup:
      "https://chat.whatsapp.com/CO7ttns7ABjLiSjVvkVBsQ?mode=gi_t",
  },
  {
    name: "Graphic Designer",
    whatsappGroup:
      "https://chat.whatsapp.com/Bmqp7Vg4BY67LmmV0S9lF0?mode=gi_t",
  },
  {
    name: "Digital Marketing Specialist",
    whatsappGroup:
      "https://chat.whatsapp.com/HaaivoMLsRRAnRPrh6CnQl?mode=gi_t",
  },
  {
    name: "SEO AEO Specialist",
    whatsappGroup:
      "https://chat.whatsapp.com/KgDfrJAn8zdG5pG4kQESdr?mode=gi_t",
  },
  {
    name: "Business Analyst",
    whatsappGroup:
      "https://chat.whatsapp.com/HS8caGY6WP80AL0W9sTzGB?mode=gi_t",
  },
  {
    name: "Project Manager",
    whatsappGroup:
      "https://chat.whatsapp.com/La7ZbjEEo4D1BSD1HHEINa?mode=gi_t",
  },
] as const;

export type BootcampName = (typeof bootcampConfigs)[number]["name"];

export const bootcamps = bootcampConfigs.map(
  (bootcamp) => bootcamp.name,
) as readonly BootcampName[];

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

export const whatsappGroups = Object.fromEntries(
  bootcampConfigs.map((bootcamp) => [bootcamp.name, bootcamp.whatsappGroup]),
) as Record<BootcampName, string>;

export const bankAccounts = [
  {
    bank: "Commercial Bank",
    accountNumber: "1000837856",
    accountName: "Codezela U K",
    branch: "Union Place",
  },
];

export function getWhatsAppGroupLink(bootcampName: string) {
  if (!isValidBootcamp(bootcampName)) {
    return null;
  }

  return whatsappGroups[bootcampName];
}

export function isValidBootcamp(name: string): name is BootcampName {
  return (bootcamps as readonly string[]).includes(name);
}

function toBootcampSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const bootcampSlugMap = Object.fromEntries(
  bootcamps.map((bootcamp) => [toBootcampSlug(bootcamp), bootcamp]),
) as Record<string, (typeof bootcamps)[number]>;

export function encodeBootcampQuery(names: string[]) {
  return names.map(toBootcampSlug).join(",");
}

export function decodeBootcampQuery(value?: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => bootcampSlugMap[entry] ?? entry)
    .filter((entry, index, array) => isValidBootcamp(entry) && array.indexOf(entry) === index);
}
