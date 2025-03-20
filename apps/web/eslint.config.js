import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import reactCompiler from 'eslint-plugin-react-compiler'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  /**
   * Next.js ESLint plugins have not yet been updated to support the new flat config format.
   * Therefore, we import them using the "FlatCompat" class which provides backward compatibility.
   *
   * This includes:
   * - next/core-web-vitals: Enforces good practices for Core Web Vitals
   * - next/typescript: Provides TypeScript-specific rules for Next.js
   * - prettier: Ensures code formatting consistency
   */
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
  }),
  /**
   * Enable the @beta React Compiler plugin
   *
   * This configuration ensures our codebase remains compatible with React Compiler
   * once it becomes stable and is enabled through Next.js. By enforcing these rules now,
   * we preemptively avoid future breaking changes or violations of the compiler's expectations.
   *
   * @see https://react.dev/learn/react-compiler
   */
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]

export default eslintConfig
