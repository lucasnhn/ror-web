'use server'
import { cookies } from 'next/headers'

export async function getSavedPreference<T>(key: string, fallback: T): Promise<T> {
  const store = await cookies()
  const value = store.get(key)?.value
  return value ? JSON.parse(value) : fallback
}

export async function setSavedPreference<T>(key: string, value: T): Promise<void> {
  const store = await cookies()
  store.set(key, JSON.stringify(value))
}

export async function deleteSavedPreference(key: string): Promise<void> {
  const store = await cookies()
  store.delete(key)
}
