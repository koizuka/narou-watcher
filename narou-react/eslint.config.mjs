/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// @ts-check
// @ts-expect-error type definition is missing
import eslint from '@eslint/js';
// @ts-expect-error type definition is missing
import pluginReactHooks from 'eslint-plugin-react-hooks';
// @ts-expect-error type definition is missing
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
// @ts-expect-error type definition is missing
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.strictTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  reactRecommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    }
  },
  {
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    plugins: {
      vitest,
    },
    settings: {
      vitest: {
        typeCheck: true
      }
    },
  },
  {
    plugins: {
      'testing-library': testingLibrary,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,

      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],

      // https://github.com/testing-library/eslint-plugin-testing-library
      "testing-library/await-async-queries": "error",
      "testing-library/await-async-utils": "error",
      "testing-library/no-await-sync-queries": "warn",
      "testing-library/no-dom-import": [
        "error",
        "react"
      ],
      "testing-library/no-wait-for-snapshot": "error"
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
    }
  },
);