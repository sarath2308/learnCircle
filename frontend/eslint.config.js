import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  // Ignore node_modules and dist folders
  globalIgnores(["node_modules", "dist"]),

  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
        URL: "readonly",
        FormData: "readonly",
        fetch: "readonly",
        localStorage: "readonly", // ✅ add this
        setInterval: "readonly", // ✅ add this
        clearInterval: "readonly", // ✅ add this
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      // Prettier integration
      "prettier/prettier": "warn",

      // General JS/TS rules
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",

      // React rules
      "react/react-in-jsx-scope": "off",

      // Spread recommended rules
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },

    settings: {
      react: { version: "detect" },
    },
  },
]);
