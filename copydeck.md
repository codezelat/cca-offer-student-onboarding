# Copydeck and Wording Fidelity Spec

## Purpose

This file defines copy fidelity requirements for rebuilding the same product in another stack.

Rule: wording on user-visible screens should remain identical unless a business-approved change is made.

Primary source files for exact wording:

- resources/views/registration/landing-sinhala.blade.php
- resources/views/registration/select-diploma.blade.php
- resources/views/registration/landing.blade.php
- resources/views/registration/register.blade.php
- resources/views/registration/payment-options.blade.php
- resources/views/registration/upload-slip.blade.php
- resources/views/registration/payhere-payment.blade.php
- resources/views/registration/payment-success.blade.php
- resources/views/registration/slip-success.blade.php
- resources/views/registration/success.blade.php
- resources/views/registration/offer-ended.blade.php
- resources/views/registration/receipt.blade.php
- resources/views/admin/login.blade.php
- resources/views/admin/dashboard.blade.php
- resources/views/admin/edit.blade.php

Note: this copydeck is the migration guide; the Blade files above remain canonical truth.

---

## Global Layout Copy

From layout wrapper:

- Default page title fallback: Student Registration
- Google Analytics ID hardcoded in layout: G-DE6V243K8N

Header:

- No top-nav text labels
- Logo only branding area

---

## Public Flow Copy (Exact Key Text)

## 1) Home Sinhala Campaign Page

Source: resources/views/registration/landing-sinhala.blade.php
Route: /

Top urgency block:

- Limited Time Opportunity
- Registration Closes In:
- Days, Hours, Minutes, Seconds

Main heading:

- Study Now Pay Later

Sinhala value proposition list:

1.

- මෙය පොළී රහිත ණය යෝජනා ක්‍රමයක් වන අතර, සමස්ථ ඩිප්ලෝමා පාඨමාලාවක්ම වන්නේ
- රු. 44,000 ක්
- පමණි.

2.

- මෙහිදී 50% ක ශිෂ්‍යත්වයක් නිපුණතා ශිෂ්‍යත්ව අරමුදල මගින් ලබා දෙනු ලැබේ. ඒ අනුව ඔබ ගෙවිය යුතු මුළු මුදල වන්නේ
- රු. 22,000 පමණී.

3.

- මෙම රු. 22,000 පාඨමාලා ගාස්තුව සිසුන් ගෙවිය යුත්තේ ඩිප්ලෝමා වැඩසටහන අවසානයේදීය. ඉන් පසු ද කිසිදු අමතර මුදලක් ගෙවිය යුතු නැත.

Seal text:

- Special
- Study
- NOW
- Pay Later

Primary CTA:

- ඩිප්ලෝමාව තෝරාගන්න (Select Diploma)

Image alt:

- Convocation Ceremony

---

## 2) Diploma Selection

Source: resources/views/registration/select-diploma.blade.php
Route: /select-diploma

Urgency block:

- Limited Time Opportunity
- Registration Closes In:
- Don’t miss your chance to enroll in our prestigious programs!

Main copy:

- Choose Your Preferred Diploma Program
- Select the diploma that aligns with your career goals and aspirations

Action button:

- Apply to Interest Free Student Loan

Diploma text comes from config full_name values and must be rendered as-is.

---

## 3) Eligibility Question Page

Source: resources/views/registration/landing.blade.php
Route: /check-eligibility?diploma={name}

Hero:

- Registration Open
- දැන්ම ලියාපදිංචි වන්න

Question:

- නොවැම්බර් 26 ආරම්භ කළ {{ $diploma }} Batch එකට දැනටමත් ලියාපදිංචි වී සිටීද?
- Please select your answer to continue with the registration process

Buttons:

- Yes
- No

If Yes card:

- Thank You for Your Interest!
- We appreciate your enthusiasm. However, as you have just started a new diploma program, you are not eligible for this loan scheme on this particular diploma program this time.
- What’s Next?
- Stay tuned for our next intake opening.

If No card:

- Perfect! Let’s Get Started
- You’re eligible to register. Click below to begin your educational journey with us!
- Register Now

---

## 4) Registration Form Page

Source: resources/views/registration/register.blade.php
Route: /register?diploma={name}

Progress copy:

- Registration Progress
- Step 1 of 3
- Details
- Payment
- Complete

Countdown card:

- Registration Closes In
- Complete your form before time runs out
- Days, Hrs, Min, Sec

Program badge:

- Selected Program

Form heading:

- Student Registration Details
- Please fill out the form accurately.

Generic error panels:

- Please fix the following errors:

Key labels and placeholders:

- Register ID \*
- Your unique registration ID. Please save this for future reference.
- Full Name \*
- Enter Full Name as per NIC/Passport
- Name With Initials \*
- Enter Name with Initials
- Gender \*
- Select Gender
- Male
- Female
- Date of Birth \*
- National ID Number \*
- Enter valid NIC (e.g., 95xxxxxxxV or 200xxxxxxxx)
- Old Format: 9 digits + V/X (e.g., 123456789V)
- New Format: 12 digits (e.g., 200012345678)
- Email Address \*
- you@example.com
- Permanent Address \*
- Enter your full permanent address
- Postal Code (Optional)
- e.g., 10200
- District \*
- Select District
- Emergency Contact Number (Home Number) \*
- e.g., 0112XXXXXX
- WhatsApp Number \*
- e.g., 07XXXXXXXX (Active number)

Terms text:

- I confirm that the information provided is accurate and I agree to the terms and conditions provided by SITC Campus via their support channels. \*

Buttons:

- Continue to Agreement
- Back

Help box:

- Need Help?
- If you have any questions or need assistance with the registration process, please contact our support team via WhatsApp at
- +94715258653

Optional course card:

- Want to Know More?
- View complete course details, syllabus, and program information for {{ $diploma }}.
- View Course Details

Client-side NIC status message:

- ✓ Valid Sri Lankan NIC
- Invalid NIC format. Use either 9 digits + V/X or 12 digits.
- Invalid day of year in NIC.
- Invalid birth year in NIC.

---

## 5) Payment Options Page

Source: resources/views/registration/payment-options.blade.php
Route: /payment/options

Progress copy:

- Registration Progress
- Step 2 of 3

Countdown support copy:

- Complete Payment Before
- Choose your payment method below

Registration details card header:

- Registration Details

Field labels in summary:

- Registration ID
- Full Name
- Name with Initials
- Gender
- NIC
- Date of Birth
- Email
- Program
- WhatsApp Number
- Emergency Contact
- District
- Postal Code
- Permanent Address
- Course Duration
- 6 Months

Primary visible payment block title:

- Study Now Pay Later

Agreement content bullets:

1.

- Students have to pay the examination fee of Rs 1,000 at the end of the course. Exam will be physical at your nearest center. We have 20+ centers island-wide. If you cannot attend the examination physically, you can request for an online examination. There is only one final examination and revision support will also be provided prior to it. Students residing abroad can also sit for the online examination.

2.

- There are no any additional fees for the certificate.
- If you are willing to participate for the convocation you will have to pay the convocation fees to BMICH only. (Approximately Rs.4,500 only if you are attending the convocation) No certificate fees. (We provide your UGC recognized university certificate - free of charge for completing the diploma).

3.

- The complete course fees is Rs. 22,000. This should be paid to a bank account under SITC Campus upon releasing results after completing the program.

Digital agreement section:

- Digital Agreement
- Full Name
- NIC Number

Primary CTA:

- I Agree & Complete Registration

Back link:

- Back to Registration Details

Important: online and slip option cards still exist in commented block in this file; keep archived copy intact in migration notes.

---

## 6) Upload Slip Page

Source: resources/views/registration/upload-slip.blade.php
Route: /payment/upload-slip

Progress copy:

- Step 3 of 3
- Upload Slip

Header card:

- Upload Payment Slip
- Complete your registration

Summary labels:

- Registration Details
- Registration ID
- Student Name
- Selected Diploma
- Amount to Pay
- LKR 4,000.00

Bank section:

- Bank Transfer Details
- You can transfer to any of these bank accounts:

Bank names:

- Bank of Ceylon
- Sampath Bank
- Commercial Bank
- People’s Bank

Shared field labels:

- Account Number:
- Account Name:
- Branch:

Warning boxes:

- Amount to Transfer: LKR 4,000.00
- Please include or write your first name in the payment slip for reference

Upload card:

- Upload Payment Slip
- Select Payment Slip \*
- Upload a file
- or drag and drop
- JPG, PNG, PDF, DOCX up to 10MB
- Selected: {filename} ({size} MB)

Buttons:

- Submit Payment Slip
- Back to Payment Options

Important notes section:

- Important Notes
- Ensure the payment slip is clear and all details are visible
- The payment slip will be verified within 2-3 business days
- Accepted formats: JPG, PNG, PDF, DOCX (Max 10MB)

---

## 7) PayHere Payment Page

Source: resources/views/registration/payhere-payment.blade.php
Route: /payment/payhere (POST renders this page)

Progress copy:

- Step 3 of 3
- Card Payment

Header copy:

- Secure Card Payment
- Complete your registration

Summary labels:

- Payment Details
- Registration ID
- Student Name
- Selected Diploma
- Total Amount
- LKR 4,000.00

Main payment call-to-action:

- Complete Your Payment
- Click the button below to proceed with secure payment
- Pay LKR 4,000.00 with PayHere
- Secure Payment Gateway

Back button:

- Back to Payment Options

Security card:

- Secure Payment
- Your payment is secured with SSL encryption
- All credit/debit card information is handled securely by PayHere
- We do not store your card details

Popup alerts:

- Payment was cancelled. You can try again or choose another payment method.
- Payment failed: {error}. Please try again or contact support.

---

## 8) Payment Success / Processing Page

Source: resources/views/registration/payment-success.blade.php
Route: /payment/payhere-success

Dynamic title:

- Payment Successful OR Payment Processing

Progress label variants:

- Step 3 of 3 - Complete!
- Step 3 of 3 - Processing

Main status variants:
Completed:

- Congratulations!
- Payment Successful!
- Welcome to the program, {{ $student->full_name }}

Processing:

- Payment Processing...
- We are verifying your payment. This usually takes a few seconds.
- Auto-refreshing in 5s...
- Check Status Now

Large ID card:

- Registration ID
- Your Registration ID
- Keep this ID safe - you’ll need it for all communications

Payment confirmation card:

- Payment Confirmation
- Payment Status
- COMPLETED
- PROCESSING
- Order ID
- Amount Paid
- Payment Date
- Pending

Details card:

- Registration Details
- Student Name
- Selected Course
- Diploma in {{ $student->selected_diploma }}
- Email
- WhatsApp

Next steps card (completed only):

- What’s Next?
- Check Your Phone
- Confirmation details will be sent via a text message
- Course Materials
- You’ll receive materials through the course WhatsApp group
- Class Schedule
- Our team will contact you with start date
- Keep Your ID
- Use your Registration ID for all communications

Buttons:

- Download Receipt
- Retry Payment
- Back to Home

WhatsApp block (completed + link resolved):

- Join WhatsApp Group
- Click the button above to join your course-specific WhatsApp group

Support block:

- Need Assistance?
- Our support team is here to help you
- +94 11 453 2139
- info@sitc.lk
- Registration ID: {{ $student->registration_id }}

---

## 9) Slip Success Page

Source: resources/views/registration/slip-success.blade.php
Rendered from: /payment/store-slip

Progress/status:

- Step 3 of 3 - Under Review
- Details, Payment, Pending

Main success text:

- Congratulations!
- Your payment slip has been uploaded successfully

Card titles:

- Payment Under Review
- Important Information

Under review bullet copy:

- Your payment slip is being verified by our team
- Verification typically takes 2-3 business days
- You will receive an email confirmation once approved

Important info bullets:

- Save your Registration ID: {{ $student->registration_id }}
- Check your messages for payment confirmation
- Course details will be sent after payment verification
- Use your Registration ID for all future communications

Buttons:

- Back to Home
- Print Details

---

## 10) Offer Ended Page

Source: resources/views/registration/offer-ended.blade.php
Route: /offer-ended

Top copy:

- Registration Period Has Ended
- Thank you for your interest in SITC Campus diploma programs
- Offer Deadline Passed

Body copy:

- We appreciate your interest in our diploma programs. Unfortunately, the registration period for this special offer has now closed.
- But don’t worry! We have more opportunities available for you.

WhatsApp section:

- Need More Information?
- Chat with us on WhatsApp to learn about upcoming intakes and special offers
- Contact Us on WhatsApp

Footer:

- SITC Campus - Empowering Your Future with Quality Education

---

## 11) Generic Success Page

Source: resources/views/registration/success.blade.php
Used for study_now_pay_later path and legacy flow

Main copy:

- Registration Successful!
- Welcome, {{ $student->name_with_initials ?? $student->full_name }}!
- You have successfully registered for the {{ $student->selected_diploma }}

ID block:

- Your Registration ID
- Please save this ID for future reference

WhatsApp card (conditional):

- Join Course WhatsApp Group
- Get instant updates, class schedules, and connect with other students in your diploma program.
- Join WhatsApp Group

Next steps card:

- Next Steps
- Check your WhatsApp for confirmation and further instructions
- Keep your Registration ID safe for future correspondence
- Our team will contact you within 2-3 business days

Buttons:

- Back to Home
- Print Confirmation

---

## 12) Receipt PDF Copy

Source: resources/views/registration/receipt.blade.php
Route: /payment/receipt/{student}

Receipt headings:

- PAYMENT RECEIPT
- Student Information
- Program Information
- Payment Details
- Course Fees Successfully Paid

Labels:

- Registration ID:
- Full Name:
- NIC:
- Email:
- Contact Number:
- Selected Program:
- Payment Method:
- Online Payment (PayHere)
- Payment Status:
- Completed
- Payment Date:

Footer:

- This is a computer-generated receipt and does not require a signature.

---

## Admin Copy (Exact Key Text)

## 13) Admin Login

Source: resources/views/admin/login.blade.php
Route: /superadminloginsitc

Main title:

- Special Registration System

Inputs:

- Email
- Password

Button:

- Sign In

Error text:

- Invalid credentials
- Plus standard validation messages

---

## 14) Admin Dashboard

Source: resources/views/admin/dashboard.blade.php
Route: /sitc-admin-area/dashboard

Header identity:

- Special Registration System
- Admin Dashboard

Logout:

- Logout

Filters/search:

- Search students...
- All Diplomas
- All Payment Methods
- Online Payment
- Bank Slip
- Study Now Pay Later
- Search
- Clear

Results text:

- Showing {first} - {last} of {total} students

Table headers:

- Registration ID
- Full Name
- Selected Diploma
- NIC
- WhatsApp
- Payment Slip
- Actions

Status/badge copy in table:

- Payment Success
- Payment Pending
- View Slip
- No slip

Empty table copy:

- No students found
- Try adjusting your search criteria

Pagination controls:

- Previous
- Next

View modal title:

- Student Details

Delete modal:

- Delete Student
- Are you sure you want to delete {name}?
- This will also delete the payment slip image if available. This action cannot be undone.
- Type DELETE to confirm:
- Type DELETE
- Cancel
- Delete

---

## 15) Admin Edit Page

Source: resources/views/admin/edit.blade.php
Route: /sitc-admin-area/student/{id}/edit

Header:

- Special Registration System
- Edit Student Information
- Back to Dashboard

Page title:

- Edit Student Record
- Update student information and details

Section header:

- Student Information

Key field labels:

- Full Name \*
- Name with Initials
- Gender \*
- NIC Number \*
- Date of Birth \*
- WhatsApp Number
- Emergency Contact Number (Home Number) \*
- Email Address \*
- Permanent Address
- Postal Code
- District
- Select District
- Selected Diploma \*
- Select a diploma

Read-only payment section:

- Payment Information (Read Only)
- Registration ID
- Payment Method
- Payment Status
- Amount Paid

Buttons:

- Cancel
- Update Student

---

## Validation and Error Message Copy (Server-Side)

Source: app/Http/Requests/StoreStudentRequest.php

Exact custom messages:

- Please enter your full name.
- Full name should only contain letters and spaces.
- Please enter your name with initials.
- Please select your gender.
- Please select a valid gender option.
- Please enter your NIC number.
- Please enter a valid NIC number (e.g., 123456789V or 123456789012).
- Date of birth must be in the past.
- Please enter a valid date of birth.
- Please enter your email address.
- Please enter a valid email address.
- Please enter your permanent address.
- Address cannot exceed 500 characters.
- Please enter a valid 5-digit postal code.
- Please select your district.
- Please enter your emergency contact number.
- Please enter a valid Sri Lankan mobile number (e.g., 0771234567).
- Please enter your WhatsApp number.
- You must accept the terms and conditions to proceed.
- Please select a diploma.
- Please select a valid diploma option.

Custom duplicate/logic failures:

- This NIC is already registered for the selected diploma.
- This email is already registered for the selected diploma.
- This WhatsApp number is already registered for the selected diploma.
- Please enter a valid Sri Lankan NIC number.

Admin login error:

- Invalid credentials

---

## SMS Copy Templates (System-Level User-Facing Copy)

Source: app/Services/SmsService.php

Online payment SMS:

- Congratulations {studentName}! Payment SUCCESSFUL for {diplomaName}. Your Registration ID: {registrationId}. Welcome to SITC!
- If link exists: You can now join the WhatsApp group: {link}

Slip payment SMS:

- Your form has been submitted for {diplomaName}. Your Registration ID: {registrationId}. Our support team will add you to the related WhatsApp group soon.

Study now pay later SMS:

- Congratulations {studentName}! Your Study Now Pay Later registration for {diplomaName} is confirmed. Your Registration ID: {registrationId}.
- If link exists: Join the WhatsApp group: {link}

Fallback SMS:

- Payment processed for {diplomaName}. Your Registration ID: {registrationId}.

---

## Mixed Language and High-Trust Copy That Must Stay Intact

These strings are conversion/trust sensitive and should not be paraphrased:

1. දැන්ම ලියාපදිංචි වන්න
2. නොවැම්බර් 26 ආරම්භ කළ {{ $diploma }} Batch එකට දැනටමත් ලියාපදිංචි වී සිටීද?
3. Study Now Pay Later (as campaign identity)
4. ඩිප්ලෝමාව තෝරාගන්න (Select Diploma)
5. Registration ID prominence phrasing:
    - Your Registration ID
    - Keep this ID safe - you’ll need it for all communications
6. Payment status words:
    - COMPLETED
    - PROCESSING
7. Offer closure identity:
    - Registration Period Has Ended
    - Offer Deadline Passed

---

## Dynamic Placeholder Policy

Any string containing template placeholders must keep sentence structure unchanged:

- {{ $diploma }}
- {{ $student->full_name }}
- {{ $student->registration_id }}
- {{ $student->selected_diploma }}
- {{ $student->email }}
- {{ $student->whatsapp_number }}
- {studentName}, {registrationId}, {diplomaName}, {link} in SMS templates

---

## Hidden/Commented Copy Policy

The following copy is currently present in source but not active in UI and should be preserved in archive docs:

- Feature cards commented in eligibility page (Flexible Learning, Expert Instructors, Certified Programs)
- Online and bank-slip option cards commented in payment options page

Treat these as dormant copy assets.

---

## Migration Acceptance for Copy Fidelity

Copy parity is accepted only when:

1. Every live page heading, CTA, field label, helper line, and status label matches this copydeck and source files.
2. Sinhala lines remain character-accurate.
3. Dynamic placeholders are inserted in the same sentence structure.
4. Error messages preserve original meaning and wording.
5. SMS templates match exact message intent and phrasing.
