import { env } from "@/lib/env";

function parseDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export function getCountdownDeadlineDate() {
  return parseDate(env.countdownDeadline);
}

export function isOfferExpired(reference = new Date()) {
  const deadline = getCountdownDeadlineDate();
  if (!deadline) {
    return false;
  }

  return reference.getTime() > deadline.getTime();
}


