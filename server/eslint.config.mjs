import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/"],
  },
  {
    files: ["src/**/*.{js,ts,jsx,tsx}", "tests/**/*.{js,ts,jsx,tsx}"],
    languageOptions: { globals: globals.node },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // test file config
  {
    files: ["tests/**/*.{js,ts,jsx,tsx}"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",
    },
  },
]);
