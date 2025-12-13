import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  globalIgnores(["node_modules", "dist"]),

  {
    files: ["**/*.{ts,tsx,js,jsx}"],

      env: {
      browser: true,
      es2021: true
    },

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
        localStorage: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
    },

    // 🔥 RULE ORDER MATTERS — recommended FIRST, custom NEXT
    rules: {
      // Recommended rules (first so your custom rules override them)
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // ========= CUSTOM RULES (your real config) =========

      // Prettier formatting
      "prettier/prettier": "warn",

      // JS / TS basics
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": "warn", // keeps code clean
      "@typescript-eslint/no-unused-vars": "warn", // TS version of above
      "@typescript-eslint/explicit-function-return-type": "off",

      // React modern JSX (React 17+)
      "react/react-in-jsx-scope": "off", // NO need for import React

      // React best practices
      "react/prop-types": "off", // not needed in TS
    },

    settings: {
      react: { version: "detect" },
    },
  },
]);
