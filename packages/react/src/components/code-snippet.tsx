import { clsx } from 'clsx'
import { ReactNode } from 'react'
import { CopyButton } from './copy-button'
import { TooltipProvider } from '@radix-ui/react-tooltip'

type CodeSnippetType = 'single' | 'inline' | 'multi'

export interface CodeSnippetProps {
  /**
   * Provide the type of Code Snippet
   */
  type: CodeSnippetType

  /**
   * The content to display
   */
  children: ReactNode
}

export function CodeSnippet({ type, children }: CodeSnippetProps) {
  const baseClass = 'r-code-snippet'
  const classes = clsx(baseClass, {
    [`${baseClass}--single`]: type === 'single',
    [`${baseClass}--inline`]: type === 'inline',
    [`${baseClass}--multi`]: type === 'multi',
  })

  return (
    <div className={classes}>
      <div
        role='textbox'
        tabIndex={0}
        className={`${baseClass}__container`}
        aria-label='Copy to clipboard'
        aria-readonly='true'
      >
        <pre>
          <code>{children}</code>
        </pre>
      </div>
      <div className={`${baseClass}__overflow-indicator--right`} />
      {type === 'single' || type === 'multi' ? (
        <TooltipProvider>
          <CopyButton className={`${baseClass}__copy-btn`} />
        </TooltipProvider>
      ) : null}
    </div>
  )
}
