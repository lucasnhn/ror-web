import { KeyboardEvent } from 'react'

export type Key = Pick<KeyboardEvent, 'code'> & {
  key?: string | string[]
}

export const Tab: Key = {
  key: 'Tab',
  code: 'Tab',
}

export const Enter: Key = {
  key: 'Enter',
  code: 'Enter',
}

export const Escape: Key = {
  key: [
    'Escape',
    // IE11 Escape
    'Esc',
  ],
  code: 'Esc',
}

export const Space: Key = {
  key: ' ',
  code: 'Space',
}

export const PageUp: Key = {
  key: 'PageUp',
  code: 'Numpad9',
}

export const PageDown: Key = {
  key: 'PageDown',
  code: 'Numpad3',
}

export const End: Key = {
  key: 'End',
  code: 'Numpad1',
}

export const Home: Key = {
  key: 'Home',
  code: 'Numpad7',
}

export const ArrowLeft: Key = {
  key: 'ArrowLeft',
  code: 'ArrowLeft',
}

export const ArrowUp: Key = {
  key: 'ArrowUp',
  code: 'ArrowUp',
}

export const ArrowRight: Key = {
  key: 'ArrowRight',
  code: 'ArrowRight',
}

export const ArrowDown: Key = {
  key: 'ArrowDown',
  code: 'ArrowDown',
}

export const Delete: Key = {
  key: 'Delete',
  code: 'ArrowDecimal',
}

/**
 * Check to see if at least one key code matches the key code of the
 * given event.
 */
export const matches = (event: KeyboardEvent, keysToMatch: Key[]) => {
  for (const keyToMatch of keysToMatch) {
    if (match(event, keyToMatch)) {
      return true
    }
  }

  return false
}

/**
 * Check to see if the given key matches the corresponding keyboard event.

 */
export const match = (eventOrCode: KeyboardEvent, { key, code }: Key) => {
  if (Array.isArray(key)) {
    return key.includes(eventOrCode.key)
  }

  return eventOrCode.key === key || eventOrCode.code === code
}
