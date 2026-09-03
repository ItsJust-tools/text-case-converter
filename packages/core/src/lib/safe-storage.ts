/**
 * Defensive wrappers around the Web Storage API (localStorage / sessionStorage).
 *
 * Browsers in Private/Incognito mode, or devices with low disk space, can throw
 * `DOMException: QuotaExceededError` or `SecurityError` on `setItem`. Unhandled
 * storage exceptions can break the application state flow or cause UI freezes.
 *
 * These helpers never throw — they log a warning and (optionally) invoke a
 * caller-supplied handler so the UI can surface a non-intrusive toast.
 */

export type StorageWarningHandler = (message: string) => void;

/** Minimal shape needed for writes. */
type WritableStorage = Pick<Storage, 'setItem'>;
/** Minimal shape needed for reads. */
type ReadableStorage = Pick<Storage, 'getItem'>;
/** Minimal shape needed for removal. */
type RemovableStorage = Pick<Storage, 'removeItem'>;

/** True when the error is a storage quota / access restriction. */
export function isStorageQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.name === 'SecurityError')
  );
}

/** Human-readable, non-technical message for a storage failure. */
export function storageWarningMessage(key: string, error: unknown): string {
  return isStorageQuotaError(error)
    ? `Storage quota exceeded — could not save "${key}". Your changes may not persist.`
    : `Storage is unavailable — could not save "${key}".`;
}

/**
 * Safely write a value to storage. Returns `true` on success, `false` on
 * failure. Never throws.
 */
export function safeSetItem(
  storage: WritableStorage,
  key: string,
  value: string,
  onWarning?: StorageWarningHandler
): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch (error) {
    const message = storageWarningMessage(key, error);
    console.warn(`[safeStorage] ${message}`, error);
    onWarning?.(message);
    return false;
  }
}

/**
 * Safely read a value from storage. Returns the stored value or `null` on
 * failure. Never throws.
 */
export function safeGetItem(storage: ReadableStorage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch (error) {
    console.warn(`[safeStorage] Failed to read "${key}":`, error);
    return null;
  }
}

/** Safely remove a value from storage. Never throws. */
export function safeRemoveItem(storage: RemovableStorage, key: string): void {
  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn(`[safeStorage] Failed to remove "${key}":`, error);
  }
}
