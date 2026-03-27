import { env } from "@/lib/env";
import { digitsOnly } from "@/lib/utils";

type SmsTemplateInput = {
  studentName: string;
  diplomaName: string;
  registrationId: string;
  link?: string | null;
};

export function composeOnlinePaymentSms(input: SmsTemplateInput) {
  const parts = [
    `Congratulations ${input.studentName}! Payment SUCCESSFUL for ${input.diplomaName}. Your Registration ID: ${input.registrationId}. Welcome to CCA!`,
  ];

  if (input.link) {
    parts.push(`You can now join the WhatsApp group: ${input.link}`);
  }

  return parts.join(" ");
}

export function composeSlipPaymentSms(input: SmsTemplateInput) {
  return `Your form has been submitted for ${input.diplomaName}. Your Registration ID: ${input.registrationId}. Our support team will add you to the related WhatsApp group soon.`;
}

export function composeStudyNowPayLaterSms(input: SmsTemplateInput) {
  const parts = [
    `Congratulations ${input.studentName}! Your Study Now Pay Later registration for ${input.diplomaName} is confirmed. Your Registration ID: ${input.registrationId}.`,
  ];

  if (input.link) {
    parts.push(`Join the WhatsApp group: ${input.link}`);
  }

  return parts.join(" ");
}

export async function sendSms(destination: string, message: string) {
  if (!env.smsApiUrl || !env.smsUsername || !env.smsPassword || !env.smsSource) {
    return { delivered: false, skipped: true };
  }

  const url = new URL(env.smsApiUrl);
  url.search = new URLSearchParams({
    username: env.smsUsername,
    password: env.smsPassword,
    src: env.smsSource,
    dst: digitsOnly(destination),
    msg: message,
    dr: "1",
  }).toString();

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    return { delivered: response.ok, skipped: false };
  } catch (error) {
    console.error("Failed to send SMS", error);
    return { delivered: false, skipped: false };
  }
}
