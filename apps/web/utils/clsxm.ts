import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * clsxm
 * @description A helper function that allows you to use clsx and tailwind-merge together.
 * @docs https://github.com/dcastil/tailwind-merge
 * @param {ClassValue[]} classes - The normal classes you would provide to clsx.
 */
const clsxm = (...classes: ClassValue[]) => twMerge(clsx(...classes))

export default clsxm
