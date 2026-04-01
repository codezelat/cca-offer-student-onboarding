<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

This file is the working agreement for coding agents in this repository. Keep it repo-specific, short enough to scan, and opinionated where the project has real constraints.

## Purpose

Use this file to answer four questions before editing anything:

1. What kind of app is this?
2. Which files are the source of truth?
3. Which invariants are easy to break?
4. How should future agents update this file when the project changes?

If a fact is not grounded in the codebase, do not put it here.

## Project Snapshot

- Framework: Next.js `16.2.1` App Router with React `19.2.4`.
- Language/tooling: TypeScript, ESLint, Vitest, Tailwind CSS v4.
- Data layer: Prisma `7.5.0`.
- Runtime DB in app code: Neon/Postgres through Prisma with the generated client at `generated/postgres/client`.
- Additional schema assets exist for MySQL under `prisma/mysql` and `generated/mysql`, but the active runtime path is Neon/Postgres.
- Persistent file storage: Vercel Blob private storage for uploaded payment slips.
- Domain: multi-step student onboarding and payment flow for CCA bootcamp registrations, plus a lightweight admin area.
- Admins can also create manual grouped registrations from `/cca-admin-area/student/new`, including optional slip attachment via the admin-only upload route.

## Repository Map

- `app/`: App Router pages and route handlers.
- `app/api/`: server endpoints for registration, admin auth/export, payment start/notify, and session cleanup.
- `app/cca-admin-area/student/new/`: admin-side manual record creation flow.
- `app/api/admin/student/slip-upload/`: admin-only Blob upload authorization for manual slip attachment.
- `components/`: public UI, admin UI, form components, and small client-side helpers.
- `lib/`: business logic, validation, content copy, config, auth/session, storage, payment, IDs, SMS, and Prisma access.
- `prisma/postgres/`: Postgres schema used for local and deployed Prisma generation.
- `prisma/mysql/`: MySQL schema assets for alternate generation paths.
- `tests/`: Vitest coverage for validation, IDs, copy parity, PayHere hashing, NIC handling, and XLSX generation.
- `public/images/`: marketing imagery used on public pages.
- `.env.example`: required local/deployed environment variables, including Neon and Blob credentials.

## Local Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Tests: `npm test`
- Watch tests: `npm run test:watch`
- Regenerate Prisma client: `npm run prisma:generate`
- Regenerate MySQL Prisma client: `npm run prisma:generate:mysql`
- Update schema locally: `npm run prisma:migrate` or `npm run prisma:push`

## Architecture Notes

- This is an App Router codebase. Prefer server components by default and add client components only where browser interactivity is required.
- Route handlers that touch Prisma, storage, crypto, or payment code explicitly run in the Node runtime. Preserve that unless you have a strong reason and verify compatibility.
- Session state is stored in an encrypted JWT cookie, not in the database.
- Registration is a staged flow:
  1. Select one or two bootcamps.
  2. Submit registration details to `/api/register`.
  3. Persist staged details in the cookie session.
  4. Choose payment path.
  5. Final persistence happens during slip upload or PayHere completion.
- Admin auth is intentionally simple and credential-based via env vars plus the encrypted session cookie.

## Critical Invariants

- Bootcamp selection is the current domain model. Some names and database fields still say `diploma`; do not rename casually unless doing a deliberate migration across UI, validation, DB, copy, and tests.
- A user may select up to two bootcamps. Multi-bootcamp persistence creates one student row per bootcamp and may suffix `registration_id` values with `-1`, `-2`, etc. Do not break that behavior accidentally.
- Registration IDs are generated from `BOOTCAMP_REG_PREFIX` in `lib/config.ts` and must continue matching validation and tests.
- Duplicate detection is scoped per bootcamp using normalized NIC, email, and WhatsApp fields.
- Payment slips are stored as private Vercel Blob objects; changing pathname conventions or auth on `/files/slips/[studentId]` affects admin access and exports.
- Online payments depend on PayHere hash generation. Treat `lib/payhere.ts` and `app/api/payment/notify/route.ts` as security-sensitive.
- Offer availability is deadline-gated. Changes to countdown/deadline logic must preserve the closed-offer behavior.

## Source Of Truth

- Business constants and bootcamp lists: `lib/config.ts`
- Environment handling: `lib/env.ts`
- Validation rules and user-facing validation copy: `lib/validation.ts`
- Public marketing and form copy: `lib/content/public.ts`
- Admin copy: `lib/content/admin.ts`
- Session schema and behavior: `lib/session.ts`
- Auth gate: `lib/auth.ts`
- Registration flow helpers: `lib/flow.ts`
- Student persistence and payment outcomes: `lib/student-service.ts`
- Postgres Prisma runtime wiring: `lib/db.ts`
- File storage behavior: `lib/storage.ts`

When changing one of these areas, inspect its downstream callers before editing.

## Environment And Secrets

- `lib/env.ts` is strict for operational secrets and required runtime settings. Missing `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `COUNTDOWN_DEADLINE`, or `DATABASE_URL` should fail fast.
- `APP_URL` falls back to `VERCEL_URL` and then `http://localhost:3000` when not set, so link generation can still work in preview and local environments.
- SMS settings and PayHere merchant settings are optional at startup, but missing values change runtime behavior: SMS silently skips, and live card payments cannot complete correctly without PayHere credentials.
- `SESSION_SECRET`, admin credentials, PayHere credentials, SMS credentials, `DATABASE_URL`, `DIRECT_URL`, and `BLOB_READ_WRITE_TOKEN` are operationally sensitive.

## Database Guidance

- The runtime Prisma client imported by application code is `@/generated/postgres/client`.
- `lib/db.ts` uses the Prisma Neon adapter and expects `DATABASE_URL` at runtime.
- `prisma.config.ts` uses `DIRECT_URL` when present and falls back to `DATABASE_URL` for Prisma CLI operations.
- Do not assume MySQL is active just because MySQL schema assets exist. Check actual imports and generation targets first.

## UI And Content Guidance

- Public pages are content-heavy and trust-sensitive. Preserve clarity around price, scholarship value, deadlines, and payment steps.
- Some public copy is intentionally bilingual or mixed-language. Do not "clean it up" unless the product change is explicit.
- `tests/copy-parity.test.ts` protects specific strings. If copy must change, update tests intentionally rather than silently breaking them.
- Keep accessibility intact when editing forms, upload flows, timers, and CTA buttons.

## Testing Guidance

- Run focused tests for the area you changed, then run `npm test` when the edit is broad enough to justify it.
- Minimum expectations:
  - Validation changes: `tests/validation.test.ts`
  - Copy changes: `tests/copy-parity.test.ts`
  - ID logic changes: `tests/ids.test.ts`
  - PayHere changes: `tests/payhere.test.ts`
  - NIC logic changes: `tests/nic.test.ts`
  - Slip upload validation/path changes: `tests/slip-files.test.ts`
  - XLSX export changes: `tests/xlsx.test.ts`
- If you change runtime behavior around Prisma or file uploads, verify the actual page or route flow manually when feasible.

## Agent Workflow Expectations

- Start by reading the relevant app code, not by assuming framework defaults.
- Prefer surgical edits over sweeping refactors.
- Preserve Node runtime declarations on server routes that need them.
- Do not replace repository-specific logic with generic starter-template patterns.
- Avoid destructive operations on `storage/` or local databases unless the task explicitly requires it.
- If editing App Router behavior, read the relevant Next.js docs page under `node_modules/next/dist/docs/` first.

## How To Create Or Update AGENTS.md

When maintaining this file, follow these rules:

1. Preserve any mandatory warning blocks exactly as-is.
2. Write facts that are true in this repository today, not generic advice that could fit any project.
3. Prefer concrete invariants over broad style opinions.
4. Mention source-of-truth files so future agents know where to look first.
5. Document only constraints that would save time or prevent breakage.
6. Include operational context when the app touches auth, payments, uploads, background state, or external services.
7. Keep commands current with `package.json`.
8. Remove stale guidance as soon as the codebase changes; stale instructions are worse than missing instructions.
9. If you add a rule, anchor it in a file, test, script, or behavior visible in the repo.
10. Do not turn this into a tutorial for the framework. It is a repo operating manual.

## Good AGENTS.md Changes

- Adding a new invariant after introducing a queue, cron, cache, or new storage backend.
- Updating command examples after scripts change.
- Recording a newly important source-of-truth file after a refactor.
- Documenting a migration boundary, such as switching runtime DBs or auth models.

## Bad AGENTS.md Changes

- Copying generic "write clean code" advice.
- Restating README marketing text without adding engineering value.
- Describing intended architecture that the repo does not yet implement.
- Leaving old instructions in place after moving files or changing flows.
- Adding long prose where a precise bullet would do.

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
