import { Prisma } from "@/generated/postgres/client";

import { getWhatsAppGroupLink, REGISTRATION_FEE } from "@/lib/config";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { getRegistrationGroupWhere } from "@/lib/registration-groups";
import {
  composeOnlinePaymentSms,
  composeSlipPaymentSms,
  composeStudyNowPayLaterSms,
  composeWhatsappLinksSms,
  sendSms,
} from "@/lib/sms";
import type {
  PaymentMethod,
  RegistrationData,
  ValidationResult,
} from "@/lib/types";
import { digitsOnly, extractFirstName } from "@/lib/utils";
import { validationMessages } from "@/lib/content/messages";

function lookupValues(data: Pick<RegistrationData, "nic" | "email" | "whatsapp_number">) {
  return {
    nic_lookup: data.nic.trim().toUpperCase(),
    email_lookup: data.email.trim().toLowerCase(),
    whatsapp_lookup: digitsOnly(data.whatsapp_number),
  };
}

function registrationToCreateInput(data: RegistrationData, bootcampName: string, suffix?: string) {
  return {
    registration_id: suffix ? `${data.registration_id}-${suffix}` : data.registration_id,
    full_name: data.full_name.trim(),
    name_with_initials: data.name_with_initials.trim(),
    gender: data.gender,
    nic: data.nic.trim().toUpperCase(),
    date_of_birth: new Date(data.date_of_birth),
    home_contact_number: data.home_contact_number.trim(),
    whatsapp_number: data.whatsapp_number.trim(),
    email: data.email.trim(),
    permanent_address: data.permanent_address.trim(),
    postal_code: data.postal_code || null,
    district: data.district,
    selected_diploma: bootcampName,
    terms_accepted: data.terms_accepted,
    ...lookupValues(data),
  } satisfies Prisma.StudentUncheckedCreateInput;
}

async function sendOutcomeSms(
  paymentMethod: PaymentMethod,
  data: RegistrationData,
  phone: string,
) {
  const bootcamps = data.selected_bootcamps.join(" & ");
  const whatsappLinks = data.selected_bootcamps
    .map((bootcamp) => getWhatsAppGroupLink(bootcamp))
    .filter((link): link is string => Boolean(link));
  const shouldSendFollowUpLinksSms =
    paymentMethod !== "slip" &&
    data.selected_bootcamps.length > 1 &&
    whatsappLinks.length > 1;
  const whatsappLink = shouldSendFollowUpLinksSms ? null : whatsappLinks[0] ?? null;
  const input = {
    studentName: data.full_name,
    diplomaName: bootcamps,
    registrationId: data.registration_id,
    link: whatsappLink,
  };

  const message =
    paymentMethod === "online"
      ? composeOnlinePaymentSms(input)
      : paymentMethod === "slip"
        ? composeSlipPaymentSms(input)
        : composeStudyNowPayLaterSms(input);

  await sendSms(phone, message);

  if (shouldSendFollowUpLinksSms) {
    const linksSms = composeWhatsappLinksSms({
      diplomaNames: data.selected_bootcamps,
      links: whatsappLinks,
    });

    if (linksSms) {
      await sendSms(phone, linksSms);
    }
  }
}

export async function checkScopedDuplicates(data: RegistrationData) {
  const values = lookupValues(data);
  const errors: Record<string, string[]> = {};

  for (const bootcamp of data.selected_bootcamps) {
    const [nic, email, whatsapp] = await Promise.all([
      prisma.student.findFirst({
        where: {
          nic_lookup: values.nic_lookup,
          selected_diploma: bootcamp,
        },
        select: { id: true },
      }),
      prisma.student.findFirst({
        where: {
          email_lookup: values.email_lookup,
          selected_diploma: bootcamp,
        },
        select: { id: true },
      }),
      prisma.student.findFirst({
        where: {
          whatsapp_lookup: values.whatsapp_lookup,
          selected_diploma: bootcamp,
        },
        select: { id: true },
      }),
    ]);

    if (nic) errors.nic = [validationMessages.nic_duplicate];
    if (email) errors.email = [validationMessages.email_duplicate];
    if (whatsapp) errors.whatsapp_number = [validationMessages.whatsapp_duplicate];
    
    if (Object.keys(errors).length > 0) break;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors } satisfies ValidationResult<RegistrationData>;
  }

  return { success: true, data } satisfies ValidationResult<RegistrationData>;
}

export async function ensureStudentForOnlinePending(data: RegistrationData, orderId: string) {
  const results = [];
  for (let i = 0; i < data.selected_bootcamps.length; i++) {
    const bootcamp = data.selected_bootcamps[i];
    const suffix = data.selected_bootcamps.length > 1 ? `${i + 1}` : undefined;
    const base = registrationToCreateInput(data, bootcamp, suffix);
    
    const regId = base.registration_id;
    const res = await prisma.student.upsert({
      where: { registration_id: regId },
      update: {
        ...base,
        payment_method: "online",
        payment_status: "pending",
        payhere_order_id: orderId,
        amount_paid: new Prisma.Decimal(0),
        payment_date: null,
      },
      create: {
        ...base,
        payment_method: "online",
        payment_status: "pending",
        payhere_order_id: orderId,
        amount_paid: new Prisma.Decimal(0),
        payment_date: null,
      },
    });
    results.push(res);
  }
  return results[0];
}

export async function completeStudyNowPayLater(data: RegistrationData) {
  const results = [];
  for (let i = 0; i < data.selected_bootcamps.length; i++) {
    const bootcamp = data.selected_bootcamps[i];
    const suffix = data.selected_bootcamps.length > 1 ? `${i + 1}` : undefined;
    const base = registrationToCreateInput(data, bootcamp, suffix);

    const regId = base.registration_id;
    const student = await prisma.student.upsert({
      where: { registration_id: regId },
      update: {
        ...base,
        payment_method: "study_now_pay_later",
        payment_status: "pending_exam_fee",
        amount_paid: new Prisma.Decimal(0),
        payment_date: new Date(),
      },
      create: {
        ...base,
        payment_method: "study_now_pay_later",
        payment_status: "pending_exam_fee",
        amount_paid: new Prisma.Decimal(0),
        payment_date: new Date(),
      },
    });
    results.push(student);
  }

  await sendOutcomeSms("study_now_pay_later", data, data.whatsapp_number);
  return results[0];
}

export async function completeSlipSubmission(
  data: RegistrationData,
  filename: string,
) {
  const results = [];
  for (let i = 0; i < data.selected_bootcamps.length; i++) {
    const bootcamp = data.selected_bootcamps[i];
    const suffix = data.selected_bootcamps.length > 1 ? `${i + 1}` : undefined;
    const base = registrationToCreateInput(data, bootcamp, suffix);

    const regId = base.registration_id;
    const student = await prisma.student.upsert({
      where: { registration_id: regId },
      update: {
        ...base,
        payment_method: "slip",
        payment_status: "pending",
        payment_slip: filename,
        amount_paid: new Prisma.Decimal(REGISTRATION_FEE * data.selected_bootcamps.length),
        payment_date: new Date(),
      },
      create: {
        ...base,
        payment_method: "slip",
        payment_status: "pending",
        payment_slip: filename,
        amount_paid: new Prisma.Decimal(REGISTRATION_FEE * data.selected_bootcamps.length),
        payment_date: new Date(),
      },
    });
    results.push(student);
  }

  await sendOutcomeSms("slip", data, data.whatsapp_number);
  return results[0];
}

export async function completeOnlinePayment(input: {
  registrationId: string;
  orderId: string;
  amount: string;
}) {
  // Find all records that start with this registrationId (could be the id itself or with -1, -2)
  const students = await prisma.student.findMany({
    where: {
      OR: [
        { registration_id: input.registrationId },
        { registration_id: { startsWith: `${input.registrationId}-` } },
      ],
    },
  });

  if (students.length === 0) {
    return null;
  }

  const results = [];
  for (const student of students) {
    const updated = await prisma.student.update({
      where: { id: student.id },
      data: {
        payment_method: "online",
        payment_status: "completed",
        payhere_order_id: input.orderId,
        amount_paid: new Prisma.Decimal(Number(input.amount) / students.length),
        payment_date: new Date(),
      },
    });
    results.push(updated);
  }

  // Send ONE SMS summarizing the whole things
  const first = results[0];
  const bootcampNames = results.map(s => s.selected_diploma);
  
  await sendOutcomeSms(
    "online",
    {
      registration_id: input.registrationId, // Use the base ID for SMS
      full_name: first.full_name,
      name_with_initials: first.name_with_initials,
      gender: first.gender as "male" | "female",
      nic: first.nic,
      date_of_birth: first.date_of_birth.toISOString(),
      email: first.email,
      permanent_address: first.permanent_address,
      postal_code: first.postal_code ?? undefined,
      district: first.district,
      home_contact_number: first.home_contact_number,
      whatsapp_number: first.whatsapp_number,
      terms_accepted: first.terms_accepted,
      selected_bootcamps: bootcampNames,
    },
    first.whatsapp_number,
  );

  return results[0];
}

export function getBootcampWhatsappLink(bootcampName: string) {
  return getWhatsAppGroupLink(bootcampName);
}

export async function getStudentByPayHereLookup(
  orderId?: string | null,
  registrationId?: string | null,
) {
  if (orderId) {
    const byOrder = await prisma.student.findFirst({
      where: { payhere_order_id: orderId },
    });
    if (byOrder) {
      return byOrder;
    }
  }

  if (registrationId) {
    return prisma.student.findUnique({
      where: { registration_id: registrationId },
    });
  }

  return null;
}

export async function buildPayHereOrder(data: RegistrationData) {
  const orderId = `ORD-${data.registration_id.replaceAll("/", "-")}-${Date.now()}`;
  await ensureStudentForOnlinePending(data, orderId);
  return {
    orderId,
    itemName: `${data.selected_bootcamps.join(" & ")} Registration`,
    amount: (REGISTRATION_FEE * data.selected_bootcamps.length).toFixed(2),
    firstName: extractFirstName(data.full_name),
  };
}

export async function getDashboardStudents(input: {
  search?: string;
  diploma?: string;
  payment_method?: string;
  page?: number;
  perPage?: number;
}) {
  const page = input.page && input.page > 0 ? input.page : 1;
  const perPage = Math.min(Math.max(input.perPage ?? 10, 1), 100);
  const where: Prisma.StudentWhereInput = {};

  if (input.diploma) {
    where.selected_diploma = input.diploma;
  }

  if (input.payment_method) {
    where.payment_method = input.payment_method;
  }

  if (input.search) {
    where.OR = [
      { registration_id: { contains: input.search } },
      { full_name: { contains: input.search } },
      { nic: { contains: input.search } },
      { whatsapp_number: { contains: input.search } },
      { email: { contains: input.search } },
    ];
  }

  const total = await prisma.student.count({ where });
  const totalPages = Math.max(Math.ceil(total / perPage), 1);
  const currentPage = Math.min(page, totalPages);
  const skip = (currentPage - 1) * perPage;

  const students = await prisma.student.findMany({
    where,
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    skip,
    take: perPage,
  });

  return {
    students,
    total,
    page: currentPage,
    perPage,
    totalPages,
  };
}

export async function updateStudentRecord(
  id: number,
  data: {
    full_name: string;
    name_with_initials: string;
    gender: "male" | "female";
    nic: string;
    date_of_birth: string;
    whatsapp_number: string;
    home_contact_number: string;
    email: string;
    permanent_address?: string;
    postal_code?: string;
    district: string;
    selected_diploma: string;
  },
) {
  const existing = await prisma.student.findUnique({
    where: { id },
    select: {
      id: true,
      registration_id: true,
    },
  });

  if (!existing) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  const groupWhere = getRegistrationGroupWhere(existing.registration_id);
  const siblingWithSameBootcamp = await prisma.student.findFirst({
    where: {
      ...groupWhere,
      selected_diploma: data.selected_diploma,
      NOT: { id },
    },
    select: { id: true },
  });

  if (siblingWithSameBootcamp) {
    throw new Error("BOOTCAMP_ALREADY_EXISTS_IN_GROUP");
  }

  const sharedData = {
    full_name: data.full_name.trim(),
    name_with_initials: data.name_with_initials.trim(),
    gender: data.gender,
    nic: data.nic.trim().toUpperCase(),
    nic_lookup: data.nic.trim().toUpperCase(),
    date_of_birth: new Date(data.date_of_birth),
    whatsapp_number: data.whatsapp_number.trim(),
    whatsapp_lookup: digitsOnly(data.whatsapp_number),
    home_contact_number: data.home_contact_number.trim(),
    email: data.email.trim(),
    email_lookup: data.email.trim().toLowerCase(),
    permanent_address: data.permanent_address?.trim() ?? "",
    postal_code: data.postal_code?.trim() || null,
    district: data.district,
  };

  const [, updatedRecord] = await prisma.$transaction([
    prisma.student.updateMany({
      where: groupWhere,
      data: sharedData,
    }),
    prisma.student.update({
      where: { id },
      data: {
        selected_diploma: data.selected_diploma,
      },
    }),
  ]);

  return updatedRecord;
}

export function getPayHereUrls(origin = env.appUrl) {
  return {
    returnUrl: `${origin}/payment/payhere-success`,
    cancelUrl: `${origin}/payment/options`,
    notifyUrl: `${origin}/api/payment/notify`,
  };
}
