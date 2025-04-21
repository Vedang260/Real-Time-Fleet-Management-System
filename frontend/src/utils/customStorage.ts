import type { StorageItem } from "@/types/storage";

const memoryStorage: { [key: string]: StorageItem } = {};

export const customStorage = {
  getItem(key: string): string | null {
    const item = memoryStorage[key];
    return item ? item.value : null;
  },
  setItem(key: string, value: string): void {
    memoryStorage[key] = { value };
  },
  removeItem(key: string): void {
    delete memoryStorage[key];
  },
};