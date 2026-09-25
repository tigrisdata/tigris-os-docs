import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: [
      ".docusaurus/**",
      "build/**",
      "node_modules/**",
      "docs/partner-integrations/api/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
        exports: "writable",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // TypeScript checks undefined names itself, including DOM types such as
    // HTMLElement, which the globals list above does not carry.
    // https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    files: ["**/*.{ts,tsx}"],
    rules: { "no-undef": "off" },
  },
  prettierConfig,
];
