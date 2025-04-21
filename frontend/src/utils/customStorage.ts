import type { StorageLike } from "pinia-plugin-persistedstate"

export class CustomStorage implements StorageLike {
  private storage = new Map<string, string>()

  getItem(key: string): string | null {
    console.log(`Getting item: ${key}`)
    return localStorage.getItem(key) || null
  }

  setItem(key: string, value: string): void {
    console.log(`Setting item: ${key} = ${value}`)
    localStorage.setItem(key, value)
  }

  removeItem(key: string): void {
    console.log(`Removing item: ${key}`)
    localStorage.removeItem(key)
  }
}

export const customStorage = new CustomStorage()