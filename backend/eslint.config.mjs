import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginPrettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: { ecmaVersion: 2020 },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig, // ✅ disables conflicting ESLint rules
    ],
    rules: {
      "prettier/prettier": "error", // ✅ report formatting issues as ESLint errors
    },
  },
]);
