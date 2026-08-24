const isDev = import.meta.env.DEV;

/** Console logging that only emits in development builds. */
export function debugLog(...args: unknown[]): void {
  if (isDev) {
    console.log(...args);
  }
}
