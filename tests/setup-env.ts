process.env.ADMIN_USERNAME ??= "test-admin@cca.local";
process.env.ADMIN_PASSWORD ??= "test-admin-password";
process.env.COUNTDOWN_DEADLINE ??= "2026-12-31T23:59:59+05:30";
process.env.SESSION_SECRET ??= "test-session-secret-for-vitest";
process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/cca_offer_student_onboarding_test?schema=public";
