// eslint.config.js
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    name: "ESLint",
    files: ["src/**/*.js"],
    ignores: ["**/*.config.js", "!**/eslint.config.js"],
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    settings: { react: { version: "19.2" } },
    rules: {
      semi: "error",
      "prefer-const": "error",
      "no-unused-vars": "error",
      "no-undef": "error",
      "react/prop-types": 0,
    },
  }
];
