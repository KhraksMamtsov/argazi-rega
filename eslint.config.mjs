import typescriptEslint from "@typescript-eslint/eslint-plugin";
// import functional from "eslint-plugin-functional";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/dist/**/*"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic",
    // "plugin:functional/no-exceptions",
    // "plugin:typescript-sort-keys/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      // functional,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: parser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".vue"],
        project: true,
      },
    },

    rules: {
      //   "sort-keys": ["error"],
      "@typescript-eslint/no-empty-interface": ["off"],
      "@typescript-eslint/unbound-method": ["off"],
      //   "functional/readonly-type": ["error", "keyword"],
      "@typescript-eslint/method-signature-style": ["error", "property"],

      //   "@typescript-eslint/ban-types": [
      //     "error",
      //     {
      //       types: {
      //         "{}": false,
      //       },

      //       extendDefaults: true,
      //     },
      //   ],

      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/no-unsafe-call": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic",
          readonly: "generic",
        },
      ],

      "@typescript-eslint/no-unnecessary-condition": "off",
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "require-yield": "off",
    },
  },
];
