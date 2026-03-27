import { env } from "@/lib/env";

export function getDeadline() {
  return env.countdownDeadline;
}
