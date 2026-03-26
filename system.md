# SITC Student Registration Offer System

## 1) Document Purpose

This document is the authoritative replication specification for rebuilding this application in a separate repository using:

- Next.js 16 (App Router)
- SQLite for local development
- MySQL for production

Goal: reproduce the same product behavior, UI flow, copy tone, states, integrations, and edge-case handling so users do not feel any functional or visual difference despite the tech stack change.

This spec captures:

- End-user journeys (public, payment, admin)
- Data model and validation rules
- State transitions
- Integrations (PayHere, SMS, WhatsApp links)
- UI look and feel, hierarchy, and motion
- Route and API contracts for a Next.js implementation
- Porting rules that preserve exact behavior, including current quirks

---

## 2) Product Definition

### 2.1 What the system is

A special-offer student registration portal for diploma programs with:

- Campaign-style landing pages
- Time-bound offer enforcement (countdown + hard server cutoff)
- Multi-step registration flow
- Payment branch handling (active and dormant methods)
- Session-based admin console for data operations and export

### 2.2 Core promise

A user can:

1. Land on a campaign page
2. Select a diploma
3. Check eligibility question
4. Fill registration details
5. Proceed through payment step
6. Receive success/pending feedback and registration identity

Admin can:

1. Login with environment credentials
2. Search/filter students
3. View/edit/delete records
4. Export spreadsheet reports

---

## 3) Exact Runtime Surfaces

## 3.1 Public routes (current behavior)

- GET /
- GET /offer-ended
- GET /select-diploma
- GET /check-eligibility?diploma={name}
- GET /register?diploma={name}
- POST /register
- GET /registration-success

## 3.2 Payment routes

- GET /payment/options
- GET /payment/upload-slip
- POST /payment/store-slip
- POST /payment/agree
- POST /payment/payhere
- GET /payment/payhere-success
- POST /payment/notify
- GET /payment/receipt/{student}
- GET /payment/success (redirects to /check-eligibility)

## 3.3 Admin routes

- GET /superadminloginsitc
- POST /superadminloginsitc
- GET /sitc-admin-area/dashboard
- GET /sitc-admin-area/export
- POST /sitc-admin-area/logout
- GET /sitc-admin-area/student/{id}
- GET /sitc-admin-area/student/{id}/edit
- PUT /sitc-admin-area/student/{id}
- DELETE /sitc-admin-area/student/{id}

## 3.4 Global middleware behavior

Registration deadline middleware is globally applied to web routes except:

- /offer-ended
- /sitc-admin-area/\*
- /superadminloginsitc

If deadline is passed: redirect to /offer-ended.
If deadline parse fails: log error and continue.

CSRF exceptions:

- payment/notify
- payment/payhere

---

## 4) Feature Inventory

### 4.1 Campaign landing

- Sinhala-heavy hero content
- Strong urgency via countdown
- Red/pink promo visual language
- CTA drives to diploma selection

### 4.2 Diploma selection

- Five program cards/radio options (config-driven)
- Continue button appears only after selection
- Continues to eligibility screen with diploma query param

### 4.3 Eligibility gate

Prompt: whether user already started Nov 26 batch for the chosen diploma.

- Yes -> show not-eligible info card
- No -> proceed to registration form

### 4.4 Registration form (Step 1 of 3)

- Multi-section form with validation and inline errors
- Generated registration ID shown as read-only
- NIC client-side feedback + server-side strict validation
- Terms acceptance required
- Form submit writes validated payload into session (not DB)

### 4.5 Payment options (Step 2 of 3)

Current active user path: Study Now Pay Later option block with agreement submit.
Dormant (commented in UI but backend exists):

- Online card payment via PayHere
- Bank slip upload option

### 4.6 PayHere flow (supported by backend and dedicated view)

- Pending student record created/updated before gateway
- MD5 hash generated in required PayHere format
- Popup-based checkout via payhere.js
- Webhook verifies md5sig and status_code == 2
- Successful notify marks payment completed + generates student_id

### 4.7 Bank slip flow

- Upload file (jpg/jpeg/png/pdf/docx/doc; max 10MB)
- Store under public disk payment_slips/
- Create/update student with pending status and amount 4000
- Show pending review confirmation screen

### 4.8 Study Now Pay Later

- Creates/updates student with payment_method=study_now_pay_later
- payment_status=pending_exam_fee
- amount_paid=0
- success screen + WhatsApp link when available

### 4.9 Receipt

- PDF receipt generation for online-only payments
- A5 portrait size

### 4.10 Admin console

- Session credential login
- Dashboard table + search + filters + pagination
- Row actions: view JSON modal, edit page, delete with typed confirm
- XLSX export with links to stored payment slips

### 4.11 Notifications

- SMS sent for online, slip, and study_now_pay_later outcomes
- Diploma-specific WhatsApp links embedded for relevant types

---

## 5) Data Model Specification

## 5.1 Canonical Student fields

- id (pk)
- registration_id (unique, required)
- student_id (unique, nullable)
- full_name (required)
- name_with_initials (required)
- gender (required; validated male/female in form request)
- nic (required)
- date_of_birth (required)
- home_contact_number (required by registration form request)
- whatsapp_number (required)
- email (required)
- permanent_address (required)
- postal_code (nullable)
- district (required)
- selected_diploma (required)
- terms_accepted (boolean)
- payment_method (nullable string)
- payment_slip (nullable string path)
- payment_status (string; defaults pending)
- payhere_order_id (nullable)
- amount_paid (decimal(10,2), nullable)
- payment_date (nullable timestamp/datetime)
- created_at, updated_at

## 5.2 Composite uniqueness rules

Must be enforced in DB and application layer:

- unique(nic, selected_diploma)
- unique(email, selected_diploma)
- unique(whatsapp_number, selected_diploma)

Meaning:

- Same person can register to different diplomas
- Cannot duplicate for same diploma by NIC/email/whatsapp

## 5.3 Registration ID format

Regex:
^SITC/SC/2025/\d+B/(EN|PC|IT|HR|BM)/\d{8}$

Generated as:
{diploma.reg_prefix}/{8-digit-random}
with DB uniqueness check loop.

## 5.4 Student ID format

{YYYY}-std-{NNNN}

- sequence starts at 2101 per year
- increments by 1 based on highest existing for that year prefix

---

## 6) Validation Specification (Server Truth)

### 6.1 Registration request validation

registration_id:

- required|string
- regex above
- unique students.registration_id

full_name:

- required|string|max255
- regex letters/spaces only: ^[a-zA-Z\s]+$

name_with_initials:

- required|string|max255

gender:

- required|string|in:male,female

nic:

- required|string
- regex old/new format: ^([0-9]{9}[vVxX]|[0-9]{12})$
- custom Sri Lankan NIC validator (old and new)
- custom duplicate check scoped by selected_diploma

date_of_birth:

- required|date
- before:today
- after:1950-01-01

email:

- required|email|max255
- custom duplicate check scoped by selected_diploma

permanent_address:

- required|string|max500

postal_code:

- nullable|string|regex ^[0-9]{5}$

district:

- required|string

home_contact_number:

- required|string|regex ^0[0-9]{9}$

whatsapp_number:

- required|string|regex ^07[0-9]{8}$
- custom duplicate check scoped by selected_diploma

terms_accepted:

- required|accepted

selected_diploma:

- required|string
- must be one of exact config names:
    - Diploma in English
    - Diploma in Psychology and Counseling
    - Diploma in Information Technology
    - Diploma in Human Resource Management
    - Diploma in Business Management

### 6.2 NIC validation logic

Old format (10 chars: 9 digits + V/X):

- birthYear = 1900 + first two digits
- dayOfYear = next 3 digits; if >500 then female and minus 500
- dayOfYear must be 1..366
- birthYear must be >=1900 and <= currentYear-10

New format (12 digits):

- birthYear = first 4 digits
- dayOfYear = digits 5..7; if >500 then female and minus 500
- same day/year bounds as above

Note: leap-year exactness is not explicitly computed; it only bounds to 366.

### 6.3 File upload validation

payment_slip:

- required
- file
- mimes: jpg,jpeg,png,pdf,docx,doc
- max: 10240 KB

### 6.4 Admin update validation differences

Admin edit uses lighter validation than public registration and does not re-apply composite uniqueness checks.
Replicate this behavior unless intentionally hardening.

---

## 7) Business Process and State Transitions

## 7.1 Registration session staging

POST /register does not persist to DB.
It stores in session:

- registration_data (full validated payload)
- registration_id
- current_step=2

## 7.2 Payment status semantics

Observed statuses:

- pending
- completed
- pending_exam_fee

Payment method values in runtime:

- online
- slip
- study_now_pay_later

## 7.3 Study Now Pay Later transition

Input: session registration_data exists.
Action:

- create/update student by registration_id
- assign generated student_id
- set payment_method=study_now_pay_later
- set payment_status=pending_exam_fee
- amount_paid=0
- payment_date=now
- send SMS
- clear registration session keys
- show success page

## 7.4 Slip transition

Input: valid file + session registration_data.
Action:

- store file under public/payment*slips/slip*{registration*id}*{timestamp}.{ext}
- create/update student by registration_id
- assign generated student_id
- payment_method=slip
- payment_status=pending
- amount_paid=4000.00
- payment_date=now
- send SMS
- clear registration session keys
- show slip-success page

## 7.5 PayHere start transition

Input: session registration_data.
Action:

- order_id = ORD-{registration_id}-{timestamp}
- store payhere_order_id in session
- create or update student to online/pending
- amount initially 0 and payment_date null on create
- generate security hash and render payhere-payment page

## 7.6 PayHere notify transition

Input: webhook payload.
Verification:
local_md5sig = uppercase(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + uppercase(md5(merchant_secret))))
Condition:

- local_md5sig equals md5sig
- status_code == 2

Then:

- find student by custom_1 (registration_id)
- if found and not already completed:
    - ensure student_id exists (generate if null)
    - set payment_method=online
    - set payment_status=completed
    - set payhere_order_id=order_id
    - set amount_paid=payhere_amount
    - set payment_date=now
    - send SMS

Always respond 200 "OK".

## 7.7 PayHere success page transition

Lookup order:

1. by query order_id or session payhere_order_id
2. fallback by session registration_data.registration_id

If student missing: redirect to landing with error.
If completed: clear session registration data/order key.
Render payment-success regardless, with completed vs processing branches.

---

## 8) UI and Visual Language Specification

## 8.1 Global visual DNA

- Overall tone: modern educational campaign + registration utility
- Primary palette: cool blue system for structure
- High-attention palette: rose/red for urgency, green for success
- Base background: neutral-50
- Card style: rounded-2xl/3xl, soft shadows, border-neutral-200/50
- Header style: sticky glass effect with logo

## 8.2 Typography

- Primary font family: Inter from Google Fonts
- Heading style: tight tracking, medium-heavy weight
- Body style: clean sans with good readability

## 8.3 Tailwind v4 tokens in use

Theme variables include:

- primary-50..900 (blue oklch scale)
- accent-50/500/600
- neutral-50..900
- font-sans Inter stack
- font-display Google Sans Display -> Inter fallback
- spacing base: 0.25rem
- custom shadows xs..2xl

Utilities:

- bg-gradient-primary
- bg-gradient-accent
- glass-effect
- transition-smooth
- text-balance

## 8.4 Motion language

Common animations:

- page enter (fade up)
- bounce-slow for icons
- pulse/ping status indicators
- shimmer on CTA highlights
- subtle scale on hover for interactive cards/buttons

## 8.5 Countdown components

Appears in multiple pages with similar card pattern:

- label "Limited Time Opportunity" or context-specific prompt
- days/hours/minutes/seconds boxes
- per-second updates
- redirect to /offer-ended on expiry

Timezone nuance:
Most pages convert env date to +05:30 by string append strategy; some pages use native Date parse directly. Preserve this behavior if exact parity is required.

---

## 9) Page-by-Page UX Specification

## 9.1 Home: / (landing-sinhala)

Purpose:

- Explain Study Now Pay Later in Sinhala
- Create urgency
- Move user to diploma selection

Key sections:

- Hero countdown in rose/pink card
- Title: Study Now Pay Later
- Sinhala 3-point explanation list with highlighted fee amounts
- Decorative red seal badge with slight rotation/hover correction
- CTA button text includes Sinhala + "Select Diploma"
- Convocation image block

Exact Sinhala copy presence is required to match trust context.

## 9.2 Diploma selection: /select-diploma

Purpose:

- Select one of 5 diplomas

Behavior:

- Alpine state selected
- Continue button hidden until selected
- click continue -> /check-eligibility?diploma={selected name}

Visual:

- countdown card reused
- card list with radio-like check indicator

## 9.3 Eligibility: /check-eligibility

Prompt references selected diploma and Nov 26 batch start.
Buttons:

- Yes: reveal not eligible response card
- No: navigate to /register?diploma={selected}

## 9.4 Register form: /register

Contains:

- Step 1 progress visual
- countdown mini-card
- selected diploma badge
- large form card
- support contact box
- optional course-link card if config has course_link

Fields in order:

1. registration_id display (readonly visual, hidden actual input)
2. full_name
3. name_with_initials
4. gender select
5. date_of_birth
6. nic (with live validate UI)
7. email
8. permanent_address
9. postal_code optional
10. district
11. home_contact_number
12. whatsapp_number
13. terms_accepted checkbox

Actions:

- submit button: Continue to Agreement
- back link to diploma selection

## 9.5 Payment options: /payment/options

Shows Step 2 and full student detail summary card.
Current primary exposed payment method:

- Study Now Pay Later block with 3 numbered policy statements and digital agreement display (name + nic readonly)
- Submit button: I Agree and Complete Registration

Contains commented-out section for online/slip cards.
This is a current product decision: backend supports those paths, but options are hidden in this view.

## 9.6 Upload slip: /payment/upload-slip

Purpose:

- manual bank transfer confirmation

Contains:

- Step 3 progress
- countdown
- selected diploma badge
- summary with amount LKR 4,000
- accordion with four banks and account details
- highlighted warnings/notes
- drag/drop style uploader
- accepted format reminder and pending verification notes

## 9.7 PayHere payment: /payment/payhere (POST render page)

Purpose:

- launch payhere.js popup

Contains:

- Step 3 progress
- summary including amount 4,000
- pay button that calls payhere.startPayment(payment)
- security info list
- retry/back patterns

payhere.js handlers:

- onCompleted -> redirect to /payment/payhere-success?order_id={id}
- onDismissed -> alert cancellation
- onError -> alert with message

## 9.8 Payment success page: /payment/payhere-success

Dual-mode page:

- completed branch: success visuals, payment confirmation, details, next steps, receipt download, WhatsApp join link (if resolved), contact block
- processing branch: spinner, auto-refresh countdown 5s, manual status check button

Important data display:

- Registration ID prominently shown
- Payment status text and color changes
- Amount fallback display uses 4000 when amount_paid <=0

## 9.9 Slip success: /payment/store-slip response

Shows:

- pending under review messaging
- registration id block
- review expectations (2-3 business days)
- print-optimized styles

## 9.10 Offer ended: /offer-ended

Campaign closure card with:

- red gradient hero
- closure message
- WhatsApp contact CTA

## 9.11 Generic success: /registration-success and study_now_pay_later result

Legacy/simple success card structure using component-based button/card.

## 9.12 Receipt PDF: /payment/receipt/{student}

- plain printable receipt style
- blue border container
- SITC logo image loaded from public path
- payment details and success message
- online payment only

---

## 10) Admin UX Specification

## 10.1 Login page

- separate plain Tailwind CDN page
- logo + title "Special Registration System"
- email/password
- duplicate error rendering block exists (replicate if exact)

## 10.2 Dashboard page

Top:

- sticky glass header with logo
- logout button

Controls:

- search input
- diploma filter
- payment method filter
- buttons: search, clear, export
- result range text

Table columns:

- Registration ID
- Full Name
- Selected Diploma
- NIC
- WhatsApp
- Payment Slip/status
- Actions

Payment slip/status column logic:

- online + completed => Payment Success badge
- online + pending => Payment Pending badge
- payment_slip path exists => View Slip link
- else => No slip

Actions:

- View opens modal with JSON fields mapped to friendly labels
- Edit navigates to edit form
- Delete opens confirm modal requiring literal DELETE typed

Pagination:

- full page number range rendering

## 10.3 Edit page

- simple form with most profile fields editable
- payment info shown read-only
- update action returns to dashboard with success flash

## 10.4 Export

XLSX with columns A-Q:
A Registration ID
B Full Name
C Name with Initials
D Gender
E NIC
F Date of Birth
G Email
H WhatsApp Number
I Home Contact
J Permanent Address
K Postal Code
L District
M Selected Diploma
N Payment Method
O Amount Paid
P Payment Date
Q Payment Slip URL (hyperlink if present)

Visual formatting:

- header bold + fill ARGB FF667eea
- header font white
- auto-size A-R (note: includes R even though headers end Q)

---

## 11) Configuration Contract

## 11.1 Required configs

Diplomas:

- name
- full_name
- reg_prefix
- course_link

Districts:

- list of 25 Sri Lankan districts

WhatsApp group mapping:

- key must match exact diploma full names used in records

PayHere:

- merchant_id
- merchant_secret
- app_id
- app_secret
- sandbox bool

SMS:

- username
- password
- source
- api_url

App:

- admin_username
- admin_password
- COUNTDOWN_DEADLINE env var

## 11.2 Known env mismatch to preserve/decide

Current .env.example documents SMS_API_KEY/SMS_SENDER_ID, while runtime service expects SMS_USERNAME/SMS_PASSWORD/SMS_SOURCE/SMS_API_URL.
For exact behavior, use runtime expectations.

---

## 12) External Integration Spec

## 12.1 PayHere

### 12.1.1 Payment initialization hash

hashedSecret = UPPERCASE(MD5(merchant_secret))
hash = UPPERCASE(MD5(merchant_id + order_id + amount + currency + hashedSecret))

### 12.1.2 Notify verification hash

local_md5sig = UPPERCASE(MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + UPPERCASE(MD5(merchant_secret))))

Success condition:

- local_md5sig equals request md5sig
- status_code == 2

### 12.1.3 Notify identity key

Use custom_1 as registration_id to resolve student.

## 12.2 SMS

HTTP GET call with query params:

- username
- password
- src
- dst
- msg
- dr=1

Behavior:

- phone cleaned to digits only
- local env may disable SSL verification
- errors are caught and logged

Message templates by payment_method:

- online: congratulatory + optional WhatsApp link
- slip: submitted + pending support team addition
- study_now_pay_later: confirmed + optional link

## 12.3 WhatsApp links

Per-diploma links used in:

- SMS composition
- success-page join CTA (for completed online)
- generic success page (if link passed)

---

## 13) Session and Auth Model

## 13.1 Public flow session keys

- registration_data
- registration_id
- current_step
- payhere_order_id

## 13.2 Admin auth model

- simple session flag admin_logged_in=true
- credential check against env config values
- no DB user table, no hashing, no RBAC

Security parity note:
This is intentionally simplistic. For strict parity, keep it. For hardening, document as approved deviation.

---

## 14) Error, Edge Case, and Quirk Specification

1. Registration success endpoint checks session key registrationId (camelCase), while earlier code writes registration_id. This makes /registration-success less reliable; preserve or intentionally fix.
2. payment-success view computes WhatsApp key as "Diploma in " + selected_diploma. If selected_diploma already stores full name, this can duplicate prefix and miss mapping.
3. Admin export styles A1:R1 though data headers are A1:Q1.
4. Payment options currently exposes only Study Now Pay Later card while other methods are commented out.
5. Date parsing for countdown varies between pages (+05:30 method vs direct Date parse).
6. Admin update does not enforce per-diploma uniqueness custom rules.
7. Some copy indicates email confirmations while runtime notifications are SMS-centric.

If your objective is exact replica, keep these quirks.
If objective is exact UX but cleaner internals, fix with a controlled compatibility note.

---

## 15) Next.js 16 Target Implementation Contract

## 15.1 Architecture mapping

Laravel concepts -> Next.js concepts:

- web routes -> app router pages
- controllers -> route handlers in app/api
- middleware -> middleware.ts
- Eloquent model -> Prisma model
- session helper -> cookie/session library
- Blade -> React server/client components

## 15.2 Recommended stack

- Next.js 16
- TypeScript strict
- Tailwind CSS v4
- Prisma ORM
- Zod for validation
- next-safe-action or route-handler validation pattern
- Iron-session or auth.js credentials for session
- xlsx package for export
- PDF generation via puppeteer or react-pdf (to match A5 layout)

## 15.3 DB portability strategy

Use Prisma with:

- provider sqlite in dev
- provider mysql in prod
- identical schema including composite uniques

Critical: ensure collation/case sensitivity behavior is tested for email uniqueness parity.

## 15.4 Proposed route map (Next)

Pages:

- app/page.tsx -> /
- app/offer-ended/page.tsx
- app/select-diploma/page.tsx
- app/check-eligibility/page.tsx
- app/register/page.tsx
- app/payment/options/page.tsx
- app/payment/upload-slip/page.tsx
- app/payment/payhere-success/page.tsx
- app/superadminloginsitc/page.tsx
- app/sitc-admin-area/dashboard/page.tsx
- app/sitc-admin-area/student/[id]/edit/page.tsx

APIs:

- app/api/register/route.ts
- app/api/payment/store-slip/route.ts
- app/api/payment/agree/route.ts
- app/api/payment/payhere/start/route.ts
- app/api/payment/notify/route.ts
- app/api/payment/receipt/[id]/route.ts
- app/api/admin/login/route.ts
- app/api/admin/logout/route.ts
- app/api/admin/student/[id]/route.ts (GET/PUT/DELETE)
- app/api/admin/export/route.ts

## 15.5 Session requirements

Need server-side session accessible by both pages and API handlers to preserve staged registration_data through payment.

## 15.6 Middleware requirements

Global deadline redirect with exclusions identical to Laravel behavior.

## 15.7 CSRF and webhook

Ensure webhook endpoint bypasses CSRF requirement while other mutating endpoints stay protected.

---

## 16) API Contract Blueprint (for Next implementation)

## 16.1 POST /api/register

Input: registration payload
Validation: full server rules above
Effects:

- write registration_data and registration_id to session
- set current_step=2
  Output:
- { success: true, message }

## 16.2 POST /api/payment/agree

Precondition: registration_data in session
Effects: create/update student with study_now_pay_later transition
Output: success page data payload

## 16.3 POST /api/payment/store-slip

Precondition: registration_data in session
Input: multipart with payment_slip
Effects: upload + create/update pending slip record
Output: success page data payload

## 16.4 POST /api/payment/payhere/start

Precondition: registration_data in session
Effects: create/update pending online record, return payment object fields with hash/order_id

## 16.5 POST /api/payment/notify

Input: PayHere fields
Effects: verify signature, update status
Output: plain text OK

## 16.6 GET /api/admin/student/{id}

Precondition: admin session
Output: student JSON

## 16.7 PUT /api/admin/student/{id}

Precondition: admin session
Validation: admin update schema

## 16.8 DELETE /api/admin/student/{id}

Precondition: admin session
Effects: remove associated payment slip file if exists

## 16.9 GET /api/admin/export

Precondition: admin session
Input: optional filters search/diploma/payment_method
Output: XLSX file stream

---

## 17) Copy and Content Fidelity Rules

To feel identical:

1. Preserve mixed Sinhala/English copy where currently present.
2. Preserve field labels exactly where practical.
3. Preserve CTA language and action verbs.
4. Preserve step labels and numbers (Details, Payment, Complete).
5. Preserve payment amount displays (4,000 and 22,000 contexts).
6. Preserve support contacts and WhatsApp flow wording.

---

## 18) Accessibility and Responsive Behavior Requirements

Current baseline behavior to match:

- Mobile-first stacked cards
- Touch-friendly controls
- Contrast adequate for major statuses
- Modals close on outside click in admin dashboard

Recommended upgrades (optional if strict parity allows):

- keyboard trap in modals
- aria labels for icons-only buttons
- reduced-motion support for heavy animations

---

## 19) Testing Matrix for Parity

## 19.1 Public flow tests

- deadline before/after behavior
- diploma selection gating
- eligibility yes/no outcomes
- registration validation matrix including NIC variants
- duplicate checks scoped by selected_diploma

## 19.2 Payment tests

- study_now_pay_later writes correct status and amount
- slip upload constraints and storage path pattern
- PayHere hash generation correctness
- webhook signature pass/fail behavior
- idempotent notify handling (already completed)
- success page processing branch auto-refresh

## 19.3 Admin tests

- login/logout
- dashboard filters and search
- export column completeness and hyperlink cells
- edit updates and validation
- delete removes record + file

## 19.4 Cross-db tests

- sqlite local and mysql prod uniqueness parity
- decimal handling for amount_paid
- date/time storage and rendering

---

## 20) Deployment and Ops Requirements

1. Configure writable upload storage for slips.
2. Serve uploaded slips publicly where admin links expect them.
3. Configure environment variables for PayHere, SMS, admin credentials, deadline.
4. Ensure webhook URL is publicly reachable and HTTPS.
5. Keep server clock correct; payment and countdown depend on timestamps.

---

## 21) Implementation Order in New Repo

1. Scaffold data schema + migrations (SQLite first)
2. Implement config constants (diplomas/districts/whatsapp)
3. Implement deadline middleware
4. Build registration pages and session staging
5. Implement Study Now Pay Later branch
6. Implement slip upload branch
7. Implement PayHere start/notify/success branch
8. Implement receipt generation
9. Build admin auth + dashboard + CRUD + export
10. Add visual polish and copy parity pass
11. Execute parity test matrix

---

## 22) Parity Acceptance Checklist

All must be true:

- Same public pages and route semantics
- Same validation outcomes and error intent
- Same per-diploma uniqueness behavior
- Same student/payment state transitions
- Same payment hash/signature algorithm
- Same admin table capabilities and export data scope
- Same visual hierarchy and campaign mood
- Same key copy and bilingual feel
- No critical flow feels different to end users

---

## 23) Non-Goals (for exact clone phase)

Do not change in clone v1 unless explicitly approved:

- auth model redesign
- payment provider switch
- business copy rewrite
- pricing model changes
- data model simplification that changes behavior

---

## 24) Optional Hardening Backlog (post-parity)

Only after exact parity is achieved:

1. Move admin auth to hashed credentials + user table
2. Normalize selected_diploma keys and WhatsApp mapping resolver
3. Unify countdown time parsing strategy
4. Add complete automated test suite
5. Add audit trail / soft deletes
6. Improve CSRF/webhook strategy with signed verification middleware
7. Align env.example SMS keys with runtime keys

---

## 25) Final Notes for the Next.js Team

This product mixes campaign storytelling and registration utility. Rebuild must preserve:

- urgency visuals
- trust cues (registration ID prominence)
- explicit payment outcomes
- easy support access

If you need to choose between cleaner code and exact behavior during first migration, choose exact behavior, then refactor in a controlled second phase with regression tests.
