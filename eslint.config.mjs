import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["node_modules", "kubernetes-yaml"], // Ignore unnecessary files
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Include Node.js globals like __dirname
        ...globals.browser
      }
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off", // ✅ Allows `require()`
      "react/react-in-jsx-scope": "off" // ✅ Avoid React import errors
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
