import type { AriaAttributes, HTMLAttributes, PropsWithChildren } from 'react'
import { clsx } from 'clsx'
import { Slot } from '@radix-ui/react-slot'

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /**
   * Specify the label for the breadcrumb container
   */
  'aria-label'?: AriaAttributes['aria-label']

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string

  /**
   * Optional prop to omit the trailing slash for the breadcrumbs
   */
  noTrailingSlash?: boolean
}

export function Breadcrumb({
  'aria-label': ariaLabel,
  children,
  className: customClassNameNav,
  noTrailingSlash,
  ...rest
}: PropsWithChildren<BreadcrumbProps>) {
  const className = clsx({
    [`r-breadcrumb`]: true,
    [`r-breadcrumb--no-trailing-slash`]: noTrailingSlash,
  })

  return (
    <nav className={customClassNameNav} aria-label={ariaLabel ?? 'Breadcrumb'} {...rest}>
      <ol className={className}>{children}</ol>
    </nav>
  )
}

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
  'aria-current'?: AriaAttributes['aria-current']

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string

  /**
   * Provide if this breadcrumb item represents the current page
   */
  isCurrentPage?: boolean

  /**
   * Merge props onto its immediate child.
   * Useful for rendering for instance a Link instead of a button.
   * @docs {@link https://www.radix-ui.com/primitives/docs/utilities/slot}
   */
  asChild?: boolean
}

export function BreadcrumbItem({
  'aria-current': ariaCurrent,
  children,
  className: customClassName = '',
  isCurrentPage,
  asChild,
  ...rest
}: PropsWithChildren<BreadcrumbItemProps>) {
  const className = clsx({
    [`r-breadcrumb__item`]: true,
    // We set the current class only if `isCurrentPage` is passed in and we do
    // not have an `aria-current="page"` set for the breadcrumb item
    [`r-breadcrumb__item--current`]: isCurrentPage && ariaCurrent !== 'page',
    [customClassName]: !!customClassName,
  })

  const Comp = asChild ? Slot : 'span'

  return (
    <li className={className} {...rest}>
      <Comp aria-current={ariaCurrent ?? isCurrentPage} className='r-breadcrumb__link'>
        {children}
      </Comp>
    </li>
  )
}
