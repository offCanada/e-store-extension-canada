import { storage } from '#imports';

/**
 * Thin typed facade over WXT's storage API, pinned to the local area.
 * Keys are stored without an area prefix; all other services go through here.
 */
export async function getStoredValue<T>(key: string): Promise<T | null> {
  const value = await storage.getItem<T>(`local:${key}`);

  return value ?? null;
}

export async function setStoredValue<T>(key: string, value: T): Promise<void> {
  await storage.setItem(`local:${key}`, value);
}

export async function removeStoredValue(key: string): Promise<void> {
  await storage.removeItem(`local:${key}`);
}

/** All stored [key, value] pairs in the local area, without area prefixes. */
export async function getStoredEntries<T>(): Promise<Array<[string, T]>> {
  const snapshot = await storage.snapshot('local');

  return Object.entries(snapshot) as Array<[string, T]>;
}
