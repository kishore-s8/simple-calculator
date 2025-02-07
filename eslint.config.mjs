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
        ...globals.node,
        ...globals.browser,
      }
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off", // ✅ Disables require() restriction
      "@typescript-eslint/no-var-requires": "off", // ✅ Ensures require() works
      "react/react-in-jsx-scope": "off"
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: { version: "18.0" } // ✅ Explicit React version (avoid detect warning)
    }
  }
];
