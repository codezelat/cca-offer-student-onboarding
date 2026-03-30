export type Gender = "male" | "female";
export type PaymentMethod = "online" | "slip" | "study_now_pay_later";
export type PaymentStatus = "pending" | "completed" | "pending_exam_fee";

export type RegistrationData = {
  registration_id: string;
  full_name: string;
  name_with_initials: string;
  gender: Gender;
  nic: string;
  date_of_birth: string;
  email: string;
  permanent_address: string;
  postal_code?: string;
  district: string;
  home_contact_number: string;
  whatsapp_number: string;
  terms_accepted: boolean;
  selected_bootcamps: string[];
};

export type SessionPayload = {
  registration_data?: RegistrationData;
  registration_id?: string;
  current_step?: number;
  payhere_order_id?: string;
  payhere_payment?: PayHerePayment;
  admin_logged_in?: boolean;
};

export type PayHerePayment = {
  sandbox: boolean;
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  custom_1: string;
  hash: string;
};

export type FormErrors = Record<string, string[]>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FormErrors };
