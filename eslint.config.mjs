import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["node_modules", "kubernetes-yaml"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // ✅ Includes Node.js globals
        ...globals.browser,
      }
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off", // ✅ Explicitly disable this rule
      "@typescript-eslint/no-var-requires": "off", // ✅ Ensures `require()` works in TS/JS
      "react/react-in-jsx-scope": "off" // ✅ Avoids React import errors
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: { version: "detect" } // ✅ Fixes React version warning
    }
  }
];
