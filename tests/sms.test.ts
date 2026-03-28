import { describe, expect, it } from "vitest";

import {
  composeOnlinePaymentSms,
  composeStudyNowPayLaterSms,
  composeWhatsappLinksSms,
} from "@/lib/sms";

describe("SMS templates", () => {
  it("includes a single WhatsApp link in the main online payment SMS", () => {
    expect(
      composeOnlinePaymentSms({
        studentName: "Jane",
        diplomaName: "Software Engineer",
        registrationId: "CCA/BC/2026/03/12345678",
        link: "https://chat.whatsapp.com/abc",
      }),
    ).toContain("You can now join the WhatsApp group: https://chat.whatsapp.com/abc");
  });

  it("includes a single WhatsApp link in the study now pay later SMS", () => {
    expect(
      composeStudyNowPayLaterSms({
        studentName: "Jane",
        diplomaName: "Software Engineer",
        registrationId: "CCA/BC/2026/03/12345678",
        link: "https://chat.whatsapp.com/abc",
      }),
    ).toContain("Join the WhatsApp group: https://chat.whatsapp.com/abc");
  });

  it("builds a compact multi-program WhatsApp links SMS", () => {
    expect(
      composeWhatsappLinksSms({
        diplomaNames: ["Software Engineer", "QA Engineer"],
        links: ["https://chat.whatsapp.com/a", "https://chat.whatsapp.com/b"],
      }),
    ).toBe(
      "WhatsApp group links for your programs: Software Engineer: https://chat.whatsapp.com/a | QA Engineer: https://chat.whatsapp.com/b",
    );
  });
});
