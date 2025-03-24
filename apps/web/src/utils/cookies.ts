'use server'
import { cookies } from 'next/headers'

export async function getSavedPreference(key: string, fallback: string): Promise<string> {
  const store = await cookies()
  const cookie = store.get(key)?.value
  return cookie ? cookie : fallback
}

export async function setSavedPreference<T extends string>(key: string, value: T): Promise<void> {
  const store = await cookies()
  store.set(key, value)
}

export async function deleteSavedPreference(key: string): Promise<void> {
  const store = await cookies()
  store.delete(key)
}
