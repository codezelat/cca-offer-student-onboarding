import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Match the usual Next.js build artifact ignores.
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "generated/**",
  ]),
]);

export default eslintConfig;
