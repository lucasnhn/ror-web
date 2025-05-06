import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter, Ubuntu_Mono } from 'next/font/google'
import { clsx } from 'clsx'
import { PublicEnvScript } from 'next-runtime-env'
import { getLeftPanelPreferenceAction } from '@/actions/left-panel'
import { getDarkModePreferenceAction } from '@/actions/dark-mode'
import { onUnhandledRequest } from '@/__mocks__/utils/on-unhandled-request'
import '@/styles/tailwind.css'
import '@/styles/globals.scss'
import { Providers } from './providers'

/**
 * Register the server-side mock server
 */
if (process.env.NEXT_PUBLIC_MOCKING_ENABLED === 'true') {
  const { server } = await import('@/__mocks__/node')
  server.listen({
    onUnhandledRequest: onUnhandledRequest,
  })
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--r-font-family-sans',
})

const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--r-font-family-mono',
})

export const metadata: Metadata = {
  title: 'ROR (Beta)',
  description: 'ROR (Release Operate Report)',
}

interface RootLayoutProps {
  children: ReactNode
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  // Retrieve the user's preferred color scheme
  // otherwise it defaults to "system"
  const theme = await getDarkModePreferenceAction()

  // Get the user's preferred sidebar open state
  const defaultSidebarOpen = await getLeftPanelPreferenceAction()

  const classes = clsx(inter.variable, ubuntuMono.variable)

  return (
    <html lang='en' className={classes} data-color-scheme={theme}>
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
