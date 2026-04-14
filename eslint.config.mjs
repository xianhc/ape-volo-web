import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      'no-lone-blocks': 'off',
      'no-extend-native': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }
      ],
      'no-debugger': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    name: 'app/vue-files',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: {
          js: 'espree',
          ts: tsParser,
          '<template>': 'espree'
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/no-v-model-argument': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off'
    }
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/build/*.js', '**/src/assets/**', '**/public/**']
  }
]
