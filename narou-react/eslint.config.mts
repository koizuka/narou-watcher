import eslint from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.strictTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  eslintReact.configs['recommended-typescript'],
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
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
