import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * On build, Next.js will only export the needed files for deployment.
   * @docs https://nextjs.org/docs/app/api-reference/config/next-config-js/output#automatically-copying-traced-files
   */
  output: 'standalone',

  experimental: {
    /**
     * Only load the modules we are actually using,
     * while still giving us the convenience of writing import statements with many named exports.
     * @docs https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
     */
    optimizePackageImports: ['@ror/react', 'radash'],
  },
}

export default nextConfig
