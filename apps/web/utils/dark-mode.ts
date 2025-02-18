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
