import { resolve } from 'node:path'
import fg from 'fast-glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import preserveDirectives from 'rollup-plugin-preserve-directives'

import pkg from './package.json'

// Defines an array of entry points to be used to search for files.
const entryPoints = ['src/**/*.tsx', 'src/**/*.ts']

// Searches for files that match the patterns defined in the array of input points.
// Returns an array of absolute file paths.
const files = fg.sync(entryPoints, { absolute: true })

// Maps the file paths in the "files" array to an array of key-value pair.
const entities = files.map((file) => {
  const regex = RegExp(/(?<=src\/).*$/)
  // Extract the part of the file path after the "lib" folder and before the file extension.
  const [key] = regex.exec(file) ?? ([] as string[])

  // Remove the file extension from the key.
  const keyWithoutExt = key.replace(/\.[^.]*$/, '')

  return [keyWithoutExt, file]
})

// Convert the array of key-value pairs to an object using the Object.fromEntries() method.
// Returns an object where each key is the file name without the extension and the value is the absolute file path.
const entries = Object.fromEntries(entities) as Record<string, string>

// Extracts the dependencies and peerDependencies from the package.json file.
const externalPackages = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const regexesOfPackages = externalPackages.map((packageName) => new RegExp(`^${packageName}(.*)?`))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: 'src',
      tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
    }),
  ],
  build: {
    outDir: 'dist',
    /**
     * Don't copy the public directory to the dist directory when building.
     * since we only care about the react components, src is only for local development.
     */
    copyPublicDir: false,
    /**
     * Turn on library mode
     * @docs {@link https://vite.dev/guide/build.html#library-mode}
     */
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      external: [...regexesOfPackages, 'react/jsx-runtime'],
      output: {
        preserveModules: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      plugins: [
        // Preserve directives such as "use client" in the output.
        // must be used together with output.preserveModules = true
        preserveDirectives(),
      ],
    },
    emptyOutDir: true,
  },
})
