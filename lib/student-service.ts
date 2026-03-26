import { Prisma } from "@/generated/sqlite/client";

import { getWhatsAppGroupLink, REGISTRATION_FEE } from "@/lib/config";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { generateStudentId } from "@/lib/ids";
import {
  composeOnlinePaymentSms,
  composeSlipPaymentSms,
  composeStudyNowPayLaterSms,
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

function registrationToCreateInput(data: RegistrationData) {
  return {
    registration_id: data.registration_id,
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
    selected_diploma: data.selected_diploma,
    terms_accepted: data.terms_accepted,
    ...lookupValues(data),
  } satisfies Prisma.StudentUncheckedCreateInput;
}

async function sendOutcomeSms(
  paymentMethod: PaymentMethod,
  data: RegistrationData,
  phone: string,
) {
  const whatsappLink = getWhatsAppGroupLink(data.selected_diploma);
  const input = {
    studentName: data.full_name,
    diplomaName: data.selected_diploma,
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
}

export async function checkScopedDuplicates(data: RegistrationData) {
  const values = lookupValues(data);
  const [nic, email, whatsapp] = await Promise.all([
    prisma.student.findFirst({
      where: {
        nic_lookup: values.nic_lookup,
        selected_diploma: data.selected_diploma,
      },
      select: { id: true },
    }),
    prisma.student.findFirst({
      where: {
        email_lookup: values.email_lookup,
        selected_diploma: data.selected_diploma,
      },
      select: { id: true },
    }),
    prisma.student.findFirst({
      where: {
        whatsapp_lookup: values.whatsapp_lookup,
        selected_diploma: data.selected_diploma,
      },
      select: { id: true },
    }),
  ]);

  const errors: Record<string, string[]> = {};
  if (nic) {
    errors.nic = [validationMessages.nic_duplicate];
  }
  if (email) {
    errors.email = [validationMessages.email_duplicate];
  }
  if (whatsapp) {
    errors.whatsapp_number = [validationMessages.whatsapp_duplicate];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    } satisfies ValidationResult<RegistrationData>;
  }

  return {
    success: true,
    data,
  } satisfies ValidationResult<RegistrationData>;
}

export async function ensureStudentForOnlinePending(data: RegistrationData, orderId: string) {
  const base = registrationToCreateInput(data);

  return prisma.student.upsert({
    where: { registration_id: data.registration_id },
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
}

export async function completeStudyNowPayLater(data: RegistrationData) {
  const studentId = await generateStudentId(prisma);
  const base = registrationToCreateInput(data);

  const student = await prisma.student.upsert({
    where: { registration_id: data.registration_id },
    update: {
      ...base,
      student_id: studentId,
      payment_method: "study_now_pay_later",
      payment_status: "pending_exam_fee",
      amount_paid: new Prisma.Decimal(0),
      payment_date: new Date(),
    },
    create: {
      ...base,
      student_id: studentId,
      payment_method: "study_now_pay_later",
      payment_status: "pending_exam_fee",
      amount_paid: new Prisma.Decimal(0),
      payment_date: new Date(),
    },
  });

  await sendOutcomeSms("study_now_pay_later", data, data.whatsapp_number);
  return student;
}

export async function completeSlipSubmission(
  data: RegistrationData,
  filename: string,
) {
  const studentId = await generateStudentId(prisma);
  const base = registrationToCreateInput(data);

  const student = await prisma.student.upsert({
    where: { registration_id: data.registration_id },
    update: {
      ...base,
      student_id: studentId,
      payment_method: "slip",
      payment_status: "pending",
      payment_slip: filename,
      amount_paid: new Prisma.Decimal(REGISTRATION_FEE),
      payment_date: new Date(),
    },
    create: {
      ...base,
      student_id: studentId,
      payment_method: "slip",
      payment_status: "pending",
      payment_slip: filename,
      amount_paid: new Prisma.Decimal(REGISTRATION_FEE),
      payment_date: new Date(),
    },
  });

  await sendOutcomeSms("slip", data, data.whatsapp_number);
  return student;
}

export async function completeOnlinePayment(input: {
  registrationId: string;
  orderId: string;
  amount: string;
}) {
  const student = await prisma.student.findUnique({
    where: { registration_id: input.registrationId },
  });

  if (!student) {
    return null;
  }

  const studentId = student.student_id ?? (await generateStudentId(prisma));

  const updated = await prisma.student.update({
    where: { id: student.id },
    data: {
      student_id: studentId,
      payment_method: "online",
      payment_status: "completed",
      payhere_order_id: input.orderId,
      amount_paid: new Prisma.Decimal(input.amount),
      payment_date: new Date(),
    },
  });

  await sendOutcomeSms(
    "online",
    {
      registration_id: updated.registration_id,
      full_name: updated.full_name,
      name_with_initials: updated.name_with_initials,
      gender: updated.gender as "male" | "female",
      nic: updated.nic,
      date_of_birth: updated.date_of_birth.toISOString(),
      email: updated.email,
      permanent_address: updated.permanent_address,
      postal_code: updated.postal_code ?? undefined,
      district: updated.district,
      home_contact_number: updated.home_contact_number,
      whatsapp_number: updated.whatsapp_number,
      terms_accepted: updated.terms_accepted,
      selected_diploma: updated.selected_diploma,
    },
    updated.whatsapp_number,
  );

  return updated;
}

export function getDiplomaWhatsappLink(selectedDiploma: string) {
  return getWhatsAppGroupLink(selectedDiploma);
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
    itemName: `${data.selected_diploma} Registration`,
    amount: REGISTRATION_FEE.toFixed(2),
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
  const perPage = input.perPage ?? 10;
  const skip = (page - 1) * perPage;
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

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: perPage,
    }),
    prisma.student.count({ where }),
  ]);

  return {
    students,
    total,
    page,
    perPage,
    totalPages: Math.max(Math.ceil(total / perPage), 1),
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
  return prisma.student.update({
    where: { id },
    data: {
      ...data,
      nic: data.nic.trim().toUpperCase(),
      nic_lookup: data.nic.trim().toUpperCase(),
      email_lookup: data.email.trim().toLowerCase(),
      whatsapp_lookup: digitsOnly(data.whatsapp_number),
      date_of_birth: new Date(data.date_of_birth),
      permanent_address: data.permanent_address ?? "",
      postal_code: data.postal_code || null,
    },
  });
}

export function getPayHereUrls() {
  return {
    returnUrl: `${env.appUrl}/payment/payhere-success`,
    cancelUrl: `${env.appUrl}/payment/options`,
    notifyUrl: `${env.appUrl}/api/payment/notify`,
  };
}
