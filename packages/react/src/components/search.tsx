'use client'
import { clsx } from 'clsx'
import { forwardRef, useId, useRef, useState } from 'react'
import type {
  HTMLAttributes,
  KeyboardEvent,
  ChangeEventHandler,
  KeyboardEventHandler,
  ChangeEvent,
  RefObject,
} from 'react'
import { Search as SearchIcon, X as CloseIcon } from 'lucide-react'
import { match, Escape } from '../utils/keyboard'
import { useCombinedRefs } from '../hooks/use-combined-refs'

export interface SearchProps extends Omit<HTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  /**
   * Specify an optional value for the `autocomplete` property on the underlying
   * `<input>`, defaults to "off"
   */
  autoComplete?: string

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string

  /**
   * Specify a label to be read by screen readers on the "close" button
   */
  closeButtonLabelText?: string

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue?: string | number

  /**
   * Specify whether the `<input>` should be disabled
   */
  disabled?: boolean

  /**
   * Specify a custom `id` for the input
   */
  id?: string

  /**
   * Provide the label text for the Search
   */
  labelText: string

  /**
   * Provide an optional placeholder text for the Search.
   * Note: if the label and placeholder differ,
   * VoiceOver on Mac will read both
   */
  placeholder?: string

  /**
   * Specify if the search icon should be display or not
   */
  disableIcon?: boolean

  /**
   * Specify the role for the underlying `<input>`, defaults to `searchbox`
   */
  role?: string

  /**
   * Specify the size of the Search
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Optional prop to specify the type of the `<input>`
   */
  type?: string

  /**
   * Specify the value of the `<input>`
   */
  value?: string | number

  /**
   * Optional callback for when the input is changed
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void

  /**
   * Optional callback for when the input is cleared
   */
  onClear?: () => void
}

/**
 * Simple utility function to check if we do have either a value or defaultValue
 */
function checkForValue<T extends string | number | undefined>(
  value: T,
  defaultValue: T,
  ref: RefObject<HTMLInputElement | null>
): boolean {
  if (value !== undefined && value !== '') {
    return true
  } else if (defaultValue !== undefined && defaultValue !== '') {
    return true
  } else if (ref.current && ref.current.value !== '') {
    return true
  }
  return false
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    autoComplete = 'off',
    className,
    closeButtonLabelText = 'Clear search input',
    defaultValue,
    disabled,
    id,
    labelText,
    onKeyDown,
    onChange,
    placeholder = 'Search',
    disableIcon = false,
    role = 'searchbox',
    size = 'md',
    type = 'text',
    value,
    onClear,
    ...rest
  },
  forwardRef
) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const combinedRef = useCombinedRefs(forwardRef, inputRef)
  const [hasContent, setHasContent] = useState(checkForValue(value, defaultValue, inputRef))

  const handleOnSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const clearInput = () => {
    if (!inputRef.current) return

    // Make sure we clear any value from the input
    // Only if the value prop is not in used or is empty
    if (typeof value === 'undefined' || (value && value.toString().length > 0)) {
      inputRef.current.value = ''
    }

    // Make sure we trigger a change event so the parent component can react to the change
    if (typeof onChange === 'function') {
      onChange({ target: inputRef.current, type: 'change' } as ChangeEvent<HTMLInputElement>)
    }

    if (typeof onClear === 'function') {
      onClear()
    }

    inputRef.current.focus()
  }

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // Make sure we trigger "hasContent" state to hide/show the clear button
    setHasContent(checkForValue(event.target.value, defaultValue, inputRef))

    if (typeof onChange === 'function') {
      onChange(event)
    }
  }

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (event: KeyboardEvent) => {
    if (match(event, Escape)) {
      event.stopPropagation()
      if (inputRef.current?.value) {
        clearInput()
      }
    }
  }

  const uniqueId = id ?? inputId
  const searchId = `${uniqueId}-search`

  const searchClasses = clsx(
    'r-search',
    {
      'r-search--sm': size === 'sm',
      'r-search--md': size === 'md',
      'r-search--lg': size === 'lg',
      'r-search--disabled': disabled,
    },
    className
  )

  const clearClasses = clsx('r-search__close', {
    'r-search__close--hidden': !hasContent,
  })

  return (
    <div role='search' aria-label={placeholder} className={searchClasses}>
      {!disableIcon ? (
        <div className='r-search__magnifier' onClick={handleOnSearchIconClick} tabIndex={-1}>
          <SearchIcon className='r-search__magnifier-icon' />
        </div>
      ) : null}
      <label id={searchId} htmlFor={uniqueId} className='r-label'>
        {labelText}
      </label>
      <input
        autoComplete={autoComplete}
        className='r-search__input'
        defaultValue={defaultValue}
        disabled={disabled}
        role={role}
        ref={combinedRef}
        id={uniqueId}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        placeholder={placeholder}
        type={type}
        value={value}
        {...rest}
      />
      <button
        aria-label={closeButtonLabelText}
        className={clearClasses}
        disabled={disabled}
        onClick={clearInput}
        title={closeButtonLabelText}
        type='button'
      >
        <CloseIcon className='r-search__close-icon' />
      </button>
    </div>
  )
})
