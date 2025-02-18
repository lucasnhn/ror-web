export const COLOR_SCHEME_COOKIE_KEY = 'ror.color-scheme'

export enum ColorScheme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export const Labels = new Map([
  [ColorScheme.System, 'System'],
  [ColorScheme.Light, 'Light'],
  [ColorScheme.Dark, 'Dark'],
])

export function isColorScheme(value: string): value is ColorScheme {
  return Object.values(ColorScheme).includes(value as ColorScheme)
}

export function validateColorScheme(value: string): ColorScheme {
  if (!isColorScheme(value)) {
    throw new Error(`Invalid color scheme: ${value}`)
  }
  return value
}
