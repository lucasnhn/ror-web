'use client'

import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover'
import { Moon, Sun, SunMoon } from 'lucide-react'
import s from './theme-toggle.module.scss'
import { getSavedPreference, removePreference, savePreference } from '@/utils/local-storage'

const STORAGE_KEY = 'theme-preference'

enum ColorScheme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

const Labels = new Map([
  [ColorScheme.System, 'System'],
  [ColorScheme.Light, 'Light'],
  [ColorScheme.Dark, 'Dark'],
])

function saveThemePreference(theme: ColorScheme) {
  if (theme === ColorScheme.System) {
    removePreference(STORAGE_KEY)
    window.document.documentElement.removeAttribute('data-color-scheme')
  } else {
    savePreference(STORAGE_KEY, theme)
    window.document.documentElement.setAttribute('data-color-scheme', theme)
  }
}

export function ThemeToggle() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getSavedPreference(STORAGE_KEY, ColorScheme.System))

  useEffect(() => {
    function handleOnMatchMediaChange({ matches: isDark }: MediaQueryListEvent) {
      const value = isDark ? ColorScheme.Dark : ColorScheme.Light
      setColorScheme(value)
      saveThemePreference(value)
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleOnMatchMediaChange)

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleOnMatchMediaChange)
    }
  }, [])

  useEffect(() => {
    document.firstElementChild?.setAttribute('data-color-scheme', colorScheme)
  }, [colorScheme])

  const setTheme = (theme: ColorScheme) => {
    setColorScheme(theme)
    saveThemePreference(theme)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ThemeToggleTrigger theme={colorScheme} />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent collisionPadding={8} sideOffset={4}>
          <div className={s.popover} role='group'>
            <span className={s.title}>Appearance</span>
            <div className={s.options}>
              <ThemeOption theme={ColorScheme.Light} onClick={setTheme} />
              <ThemeOption theme={ColorScheme.Dark} onClick={setTheme} />
              <ThemeOption theme={ColorScheme.System} onClick={setTheme} />
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}

interface ThemeToggleTriggerProps {
  theme: ColorScheme
}

function ThemeToggleTrigger({ theme, ...rest }: ThemeToggleTriggerProps) {
  return (
    <button
      className='w-8 h-8 shrink-0 cursor-pointer hover:bg-(--r-background-hover) flex items-center justify-center justify-self-end rounded-sm border border-(--r-border-subtle-00)'
      {...rest}
    >
      <ThemeIcon theme={theme} />
    </button>
  )
}

function ThemeIcon({ theme }: { theme: ColorScheme }) {
  switch (theme) {
    case ColorScheme.Light:
      return <Sun className='w-4 h-4 text-(--r-icon-primary)' />
    case ColorScheme.Dark:
      return <Moon className='w-4 h-4 text-(--r-icon-primary)' />
    case ColorScheme.System:
      return <SunMoon className='w-4 h-4 text-(--r-icon-primary)' />
    default:
      return null
  }
}

function ThemeOption({ theme, onClick }: { theme: ColorScheme; onClick: (value: ColorScheme) => void }) {
  const handleOnClick = () => {
    onClick(theme)
  }

  return (
    <div className={s.option} role='option' data-value={theme} onClick={handleOnClick}>
      <figure className='rounded-md'>
        <ThemePreview theme={theme} />
      </figure>
      <div className={s.label}>{Labels.get(theme)}</div>
    </div>
  )
}

function ThemePreview({ theme }: { theme: ColorScheme }) {
  const classes = 'rounded-[inherit]'
  switch (theme) {
    case ColorScheme.Light:
      return (
        <svg xmlns='http://www.w3.org/2000/svg' width='70' height='50' viewBox='0 0 70 50' className={classes}>
          <path fill='#e5e5e6' d='M0 0h70v50H0z'></path>
          <path fill='#fff' d='M14 10h56v40H10V14a4 4 0 0 1 4-4'></path>
          <circle cx='18' cy='18' r='3' fill='#e5e5e6'></circle>
          <circle cx='27' cy='18' r='3' fill='#e5e5e6'></circle>
          <circle cx='36' cy='18' r='3' fill='#e5e5e6'></circle>
          <rect width='46' height='3' x='17' y='28' fill='#38393e' rx='1'></rect>
          <rect width='46' height='3' x='17' y='34' fill='#38393e' rx='1'></rect>
          <rect width='30' height='3' x='17' y='40' fill='#38393e' rx='1'></rect>
        </svg>
      )
    case ColorScheme.Dark:
      return (
        <svg xmlns='http://www.w3.org/2000/svg' width='70' height='50' viewBox='0 0 70 50' className={classes}>
          <path fill='#22232a' d='M0 0h70v50H0z'></path>
          <path fill='#5a5c63' d='M14 10h56v40H10V14a4 4 0 0 1 4-4'></path>
          <circle cx='18' cy='18' r='3' fill='#22232a'></circle>
          <circle cx='27' cy='18' r='3' fill='#22232a'></circle>
          <circle cx='36' cy='18' r='3' fill='#22232a'></circle>
          <rect width='46' height='3' x='17' y='28' fill='#fafaff' rx='1'></rect>
          <rect width='46' height='3' x='17' y='34' fill='#fafaff' rx='1'></rect>
          <rect width='30' height='3' x='17' y='40' fill='#fafaff' rx='1'></rect>
        </svg>
      )
    case ColorScheme.System:
      return (
        <svg xmlns='http://www.w3.org/2000/svg' width='70' height='50' viewBox='0 0 70 50' className={classes}>
          <path fill='#e5e5e6' d='M0 0h35v50H0z'></path>
          <path fill='#fff' d='M14 10h21v40H10V14a4 4 0 0 1 4-4'></path>
          <circle cx='18' cy='18' r='3' fill='#e5e5e6'></circle>
          <circle cx='27' cy='18' r='3' fill='#e5e5e6'></circle>
          <path
            fill='#38393e'
            d='M18 28h17v3H18a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1M18 34h17v3H18a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1M18 40h17v3H18a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1'
          ></path>
          <path fill='#22232a' d='M35 0h35v50H35z'></path>
          <path fill='#5a5c63' d='M49 10h21v40H45V14a4 4 0 0 1 4-4'></path>
          <circle cx='53' cy='18' r='3' fill='#22232a'></circle>
          <circle cx='62' cy='18' r='3' fill='#22232a'></circle>
          <path
            fill='#fafaff'
            d='M53 28h17v3H53a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1M53 34h17v3H53a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1M53 40h17v3H53a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1'
          ></path>
        </svg>
      )
    default:
      return null
  }
}
