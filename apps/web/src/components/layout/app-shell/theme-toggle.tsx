'use client'

import { useColorScheme, useSetColorScheme } from '@/context/color-theme-context'
import { ColorScheme, Labels } from '@/utils/dark-mode'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover'
import { Layer } from '@ror/react'
import { Moon, Sun, SunMoon } from 'lucide-react'
import { useEffect } from 'react'
import s from './theme-toggle.module.scss'

interface ThemeToggleProps {
  colorScheme: ColorScheme
}

export function ThemeToggle({ colorScheme }: ThemeToggleProps) {
  // Setup listeners for changes in the user's color scheme preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = colorScheme === ColorScheme.System ? (isDark ? 'dark' : 'light') : colorScheme

    document.documentElement.classList.toggle('dark', resolved === 'dark')

    const handleOnMatchMediaChange = ({ matches: isDark }: MediaQueryListEvent) => {
      if (colorScheme === ColorScheme.System) {
        document.documentElement.classList.toggle('dark', isDark)
      }
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleOnMatchMediaChange)
    return () => mediaQuery.removeEventListener('change', handleOnMatchMediaChange)
  }, [colorScheme])

  const current = useColorScheme()
  const setScheme = useSetColorScheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ThemeToggleTrigger theme={current} />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent collisionPadding={8} sideOffset={4}>
          <Layer level={0}>
            <div className='bg-[var(--r-layer)] p-4 rounded-md flex flex-wrap gap-3 self' role='group'>
              <ThemeOption theme={ColorScheme.Light} isActive={current === 'light'} onClick={setScheme} />
              <ThemeOption theme={ColorScheme.Dark} isActive={current === 'dark'} onClick={setScheme} />
              <ThemeOption theme={ColorScheme.System} isActive={current === 'system'} onClick={setScheme} />
            </div>
          </Layer>
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
      className='w-7 h-7 shrink-0 cursor-pointer hover:bg-background-hover flex items-center justify-center justify-self-end rounded-sm border border-subtle'
      title='Open theme menu'
      {...rest}
    >
      <ThemeIcon theme={theme} />
    </button>
  )
}

function ThemeIcon({ theme }: { theme: ColorScheme }) {
  switch (theme) {
    case ColorScheme.Light:
      return <Sun className='w-5 h-5 text-(--r-icon-primary)' />
    case ColorScheme.Dark:
      return <Moon className='w-5 h-5 text-(--r-icon-primary)' />
    case ColorScheme.System:
      return <SunMoon className='w-5 h-5 text-(--r-icon-primary)' />
    default:
      return null
  }
}

function ThemeOption({
  theme,
  isActive,
  onClick,
}: {
  theme: ColorScheme
  isActive: boolean
  onClick: (value: ColorScheme) => void
}) {
  const handleOnClick = () => {
    onClick(theme)
  }

  const label = Labels.get(theme)

  return (
    <div className={`${s.option}`} role='option' data-value={theme} aria-selected={isActive} onClick={handleOnClick}>
      <figure className='rounded-md'>
        <ThemePreview theme={theme} />
      </figure>
      <div className={s.label}>{label}</div>
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
