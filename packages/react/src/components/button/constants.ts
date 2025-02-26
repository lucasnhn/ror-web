export const ButtonSizes = ['sm', 'md', 'lg'] as const
export const ButtonVariants = ['primary', 'secondary', 'tertiary', 'danger', 'ghost'] as const

export type ButtonSize = (typeof ButtonSizes)[number]
export type ButtonVariant = (typeof ButtonVariants)[number]
