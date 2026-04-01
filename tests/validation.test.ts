import { describe, expect, it } from "vitest";

import { validateAdminCreateInput, validateRegistrationInput } from "@/lib/validation";

describe("registration validation", () => {
  it("returns exact duplicate-friendly server copy for missing fields", () => {
    const result = validateRegistrationInput({
      registration_id: "",
      full_name: "",
      name_with_initials: "",
      gender: "",
      nic: "",
      date_of_birth: "",
      email: "",
      permanent_address: "",
      postal_code: "",
      district: "",
      home_contact_number: "",
      whatsapp_number: "",
      terms_accepted: false,
      selected_bootcamps: [],
    });
    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error("Expected validation failure");
    }
    expect(result.errors.full_name?.[0]).toBe("Please enter your full name.");
    expect(result.errors.email?.[0]).toBe("Please enter your email address.");
  });

  it("accepts a valid registration payload", () => {
    const result = validateRegistrationInput({
      registration_id: "CCA/BC/2026/03/12345678",
      full_name: "Jane Doe",
      name_with_initials: "J. Doe",
      gender: "female",
      nic: "951231234V",
      date_of_birth: "1995-05-01",
      email: "jane@example.com",
      permanent_address: "123 Main Street",
      postal_code: "10200",
      district: "Colombo",
      home_contact_number: "0112345678",
      whatsapp_number: "0771234567",
      terms_accepted: true,
      selected_bootcamps: ["Software Engineer"],
    });

    expect(result.success).toBe(true);
  });
});

describe("admin create validation", () => {
  it("accepts a valid manual admin record payload", () => {
    const result = validateAdminCreateInput({
      full_name: "Jane Doe",
      name_with_initials: "J. Doe",
      gender: "female",
      nic: "951231234V",
      date_of_birth: "1995-05-01",
      email: "jane@example.com",
      permanent_address: "123 Main Street",
      postal_code: "10200",
      district: "Colombo",
      home_contact_number: "0112345678",
      whatsapp_number: "0771234567",
      selected_bootcamps: ["Software Engineer", "QA Engineer"],
      payment_setup: "online_completed",
    });

    expect(result.success).toBe(true);
  });

  it("rejects duplicate bootcamp selections in admin create", () => {
    const result = validateAdminCreateInput({
      full_name: "Jane Doe",
      name_with_initials: "J. Doe",
      gender: "female",
      nic: "951231234V",
      date_of_birth: "1995-05-01",
      email: "jane@example.com",
      permanent_address: "123 Main Street",
      postal_code: "10200",
      district: "Colombo",
      home_contact_number: "0112345678",
      whatsapp_number: "0771234567",
      selected_bootcamps: ["Software Engineer", "Software Engineer"],
      payment_setup: "online_completed",
    });

    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error("Expected validation failure");
    }
    expect(result.errors.selected_bootcamps?.[0]).toBe(
      "Please select each bootcamp only once.",
    );
  });
});
