'use client'

import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import * as React from 'react'
import { forwardRef, useEffect } from 'react'

import { cn } from '@/utils/clsxm'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/shadcn/command'
import { Cross2Icon } from '@radix-ui/react-icons'

export interface Option {
  value: string
  label: string
  disable?: boolean
  /** fixed option that can‘t be removed. */
  fixed?: boolean
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined
}

interface GroupOption {
  [key: string]: Option[]
}

interface MultipleSelectorProps {
  value?: Option[]
  defaultOptions?: Option[]
  /** manually controlled options */
  options?: Option[]
  placeholder?: string
  /** Loading component. */
  loadingIndicator?: React.ReactNode
  /** Empty component. */
  emptyIndicator?: React.ReactNode
  delay?: number
  triggerSearchOnFocus?: boolean
  onSearch?: (value: string) => Promise<Option[]>
  onSearchSync?: (value: string) => Option[]
  onChange?: (options: Option[]) => void
  maxSelected?: number
  onMaxSelected?: (maxLimit: number) => void
  hidePlaceholderWhenSelected?: boolean
  disabled?: boolean
  groupBy?: string
  className?: string
  badgeClassName?: string
  selectFirstItem?: boolean
  creatable?: boolean
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  inputProps?: Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'value' | 'placeholder' | 'disabled'>
  hideClearAllButton?: boolean
}

export interface MultipleSelectorRef {
  selectedValue: Option[]
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// ---------- Helpers ----------
const sameSel = (a: Option[], b: Option[]) => a.length === b.length && a.every((v, i) => v.value === b[i]?.value)

const addIfNew = (curr: Option[], next: Option) => (curr.some((s) => s.value === next.value) ? curr : [...curr, next])

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) return {}
  if (!groupBy) return { '': options }

  const groupOption: GroupOption = {}
  options.forEach((option) => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption
  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter((val) => !picked.find((p) => p.value === val.value))
  }
  return cloneOption
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetOption.find((p) => p.value === option.value))) {
      return true
    }
  }
  return false
}

const CommandEmpty = forwardRef<HTMLDivElement, React.ComponentProps<typeof CommandPrimitive.Empty>>(
  ({ className, ...props }, forwardedRef) => {
    const render = useCommandState((state) => state.filtered.count === 0)
    if (!render) return null
    return (
      <div
        ref={forwardedRef}
        className={cn('px-2 py-4 text-center text-sm', className)}
        cmdk-empty=''
        role='presentation'
        {...props}
      />
    )
  }
)
CommandEmpty.displayName = 'CommandEmpty'

// ---------- Component ----------
const MultipleSelector = React.forwardRef<MultipleSelectorRef, MultipleSelectorProps>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [onScrollbar, setOnScrollbar] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const [selected, setSelected] = React.useState<Option[]>(value || [])
    const [options, setOptions] = React.useState<GroupOption>(transToGroupOption(arrayDefaultOptions, groupBy))
    const [inputValue, setInputValue] = React.useState('')
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected([]),
      }),
      [selected]
    )

    // Keep selected in sync with prop.value, but only if different
    useEffect(() => {
      if (value && !sameSel(value, selected)) {
        setSelected(value)
      }
    }, [value, selected])

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value)
        if (!sameSel(newOptions, selected)) {
          setSelected(newOptions)
          onChange?.(newOptions)
        }
      },
      [onChange, selected]
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && selected.length > 0) {
              const last = selected[selected.length - 1]
              if (last && !last.fixed) {
                handleUnselect(last)
              }
            }
          }
          if (e.key === 'Escape') {
            input.blur()
          }
        }
      },
      [handleUnselect, selected]
    )

    // ---- Options sync ----
    useEffect(() => {
      if (!arrayOptions || onSearch) return
      const newOptions = transToGroupOption(arrayOptions, groupBy)
      const newKey = Object.entries(newOptions)
        .flatMap(([k, arr]) => [k, ...arr.map((o) => o.value)])
        .join('|')
      const currKey = Object.entries(options)
        .flatMap(([k, arr]) => [k, ...arr.map((o) => o.value)])
        .join('|')
      if (newKey !== currKey) {
        setOptions(newOptions)
      }
    }, [arrayOptions, groupBy, onSearch, options])

    // ---- Search effects (sync & async) ----
    useEffect(() => {
      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm)
        setOptions(transToGroupOption(res || [], groupBy))
      }
      if (onSearchSync && open && (debouncedSearchTerm || triggerSearchOnFocus)) {
        doSearchSync()
      }
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus, onSearchSync])

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true)
        const res = await onSearch?.(debouncedSearchTerm)
        setOptions(transToGroupOption(res || [], groupBy))
        setIsLoading(false)
      }
      if (onSearch && open && (debouncedSearchTerm || triggerSearchOnFocus)) {
        void doSearch()
      }
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus, onSearch])

    // ---- Dropdown close on outside click ----
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
          inputRef.current.blur()
        }
      }
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchend', handleClickOutside)
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }
    }, [open])

    // ---- Creatable item ----
    const CreatableItem = () => {
      if (!creatable) return undefined
      if (
        isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
        selected.find((s) => s.value === inputValue)
      ) {
        return undefined
      }
      const Item = (
        <CommandItem
          value={inputValue}
          className='cursor-pointe mx-1 mb-1'
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onSelect={(val: string) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length)
              return
            }
            setInputValue('')
            const next = addIfNew(selected, { value: val, label: val })
            if (!sameSel(next, selected)) {
              setSelected(next)
              onChange?.(next)
            }
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      )
      if (!onSearch && inputValue.length > 0) return Item
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) return Item
      return undefined
    }

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value='-' disabled>
            {emptyIndicator}
          </CommandItem>
        )
      }
      return <CommandEmpty>{emptyIndicator}</CommandEmpty>
    }, [creatable, emptyIndicator, onSearch, options])

    const selectables = React.useMemo<GroupOption>(() => removePickedOption(options, selected), [options, selected])

    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) return commandProps.filter
      if (creatable) {
        return (value: string, search: string) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1)
      }
      return undefined
    }, [creatable, commandProps?.filter])

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        onKeyDown={(e) => {
          handleKeyDown(e)
          commandProps?.onKeyDown?.(e)
        }}
        className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
        shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch}
        filter={commandFilter()}
      >
        <span className='text-xs mt-[-16px]'>{commandProps?.label}</span>
        <div
          className={cn(
            'relative min-h-[38px] rounded-lg border border-input text-sm transition-shadow focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20',
            { 'p-1': selected.length !== 0, 'cursor-text': !disabled && selected.length !== 0 },
            !hideClearAllButton && 'pe-9',
            className
          )}
          onClick={() => {
            if (!disabled) inputRef?.current?.focus()
          }}
        >
          <div className='flex overflow-x-scroll gap-1 scrollbar-hide'>
            {selected.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'animate-fadeIn min-w-fit relative inline-flex h-7 items-center rounded-md border bg-background pe-7 pl-2 text-xs font-medium',
                  badgeClassName
                )}
                data-fixed={option.fixed}
                data-disabled={disabled || undefined}
              >
                {option.label}
                <button
                  className='absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-lg p-0'
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option)}
                  aria-label='Remove'
                >
                  <Cross2Icon width={14} height={14} strokeWidth={2} />
                </button>
              </div>
            ))}
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(val) => {
                setInputValue(val)
                inputProps?.onValueChange?.(val)
              }}
              onBlur={(e) => {
                if (!onScrollbar) setOpen(false)
                inputProps?.onBlur?.(e)
              }}
              onFocus={(e) => {
                setOpen(true)
                if (triggerSearchOnFocus) onSearch?.(debouncedSearchTerm)
                inputProps?.onFocus?.(e)
              }}
              placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
              className={cn(
                'flex-1 min-w-0 outline-none placeholder:text-muted-foreground text-sm',
                {
                  'w-52': hidePlaceholderWhenSelected,
                  'px-3 py-2': selected.length === 0,
                  'ml-1 pt-2': selected.length !== 0,
                },
                inputProps?.className
              )}
            />
            <button
              type='button'
              onClick={() => {
                const next = selected.filter((s) => s.fixed)
                if (!sameSel(next, selected)) {
                  setSelected(next)
                  onChange?.(next)
                }
              }}
              className={cn(
                'absolute end-0 top-0 flex size-9 items-center justify-center rounded-lg text-muted-foreground/80',
                (hideClearAllButton ||
                  disabled ||
                  selected.length < 1 ||
                  selected.filter((s) => s.fixed).length === selected.length) &&
                  'hidden'
              )}
              aria-label='Clear all'
            >
              <Cross2Icon width={16} height={16} strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className='relative'>
          <div
            className={cn('absolute top-2 z-10 w-52 overflow-hidden rounded-lg border border-input', !open && 'hidden')}
            data-state={open ? 'open' : 'closed'}
          >
            {open && (
              <CommandList
                className='bg-popover text-popover-foreground shadow-lg'
                onMouseLeave={() => setOnScrollbar(false)}
                onMouseEnter={() => setOnScrollbar(true)}
                onMouseUp={() => inputRef?.current?.focus()}
              >
                {isLoading ? (
                  <>{loadingIndicator}</>
                ) : (
                  <>
                    {EmptyItem()}
                    {CreatableItem()}
                    {!selectFirstItem && <CommandItem value='-' className='hidden' />}
                    {Object.entries(selectables).map(([key, dropdowns]) => (
                      <CommandGroup key={key} heading={key}>
                        {dropdowns.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disable}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                            onSelect={() => {
                              if (selected.length >= maxSelected) {
                                onMaxSelected?.(selected.length)
                                return
                              }
                              setInputValue('')
                              const next = addIfNew(selected, option)
                              if (!sameSel(next, selected)) {
                                setSelected(next)
                                onChange?.(next)
                              }
                            }}
                            className={cn('cursor-pointer', option.disable && 'cursor-not-allowed opacity-50')}
                          >
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </>
                )}
              </CommandList>
            )}
          </div>
        </div>
      </Command>
    )
  }
)

MultipleSelector.displayName = 'MultipleSelector'
export default MultipleSelector
