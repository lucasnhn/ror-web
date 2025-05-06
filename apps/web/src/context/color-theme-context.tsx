'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ColorScheme, validateColorScheme } from '@/utils/dark-mode'

const ColorSchemeContext = createContext<ColorScheme>(ColorScheme.System)
const ColorSchemeUpdateContext = createContext<(scheme: ColorScheme) => void>(() => {})

export function useColorScheme() {
  return useContext(ColorSchemeContext)
}

export function useSetColorScheme() {
  return useContext(ColorSchemeUpdateContext)
}

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<ColorScheme>(ColorScheme.System)

  // Keep Tailwind `dark:` classes in sync with theme
  const applyResolvedTheme = (current: ColorScheme) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = current === 'system' ? (prefersDark ? 'dark' : 'light') : current

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolved)
    document.documentElement.dataset.colorScheme = current
  }

  // Init on mount
  useEffect(() => {
    const saved = document.documentElement.dataset.colorScheme as ColorScheme
    const validScheme = validateColorScheme(saved)
    setScheme(validScheme)
    applyResolvedTheme(validScheme)

    const listener = () => {
      if (scheme === 'system') applyResolvedTheme(ColorScheme.System)
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener)
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener)
  }, [scheme])

  // Used when toggling theme
  const updateScheme = async (newScheme: ColorScheme) => {
    setScheme(newScheme)
    applyResolvedTheme(newScheme)

    await fetch('/api/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: newScheme }),
    })
  }

  return (
    <ColorSchemeContext.Provider value={scheme}>
      <ColorSchemeUpdateContext.Provider value={updateScheme}>{children}</ColorSchemeUpdateContext.Provider>
    </ColorSchemeContext.Provider>
  )
}
