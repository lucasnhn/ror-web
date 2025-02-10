import { resolve } from 'node:path'
import fg from 'fast-glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'

// Defines an array of entry points to be used to search for files.
const entryPoints = ['src/**/*.tsx']

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
      external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    emptyOutDir: true,
  },
})
