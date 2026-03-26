import { redirect } from "next/navigation";

export default function LegacyPaymentSuccessRedirectPage() {
  redirect("/check-eligibility");
}
