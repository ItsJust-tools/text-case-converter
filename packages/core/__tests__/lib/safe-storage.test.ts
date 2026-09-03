import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  safeSetItem,
  safeGetItem,
  safeRemoveItem,
  isStorageQuotaError,
  storageWarningMessage,
} from '../../src/lib/safe-storage';

describe('safe-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes and reads values normally', () => {
    expect(safeSetItem(localStorage, 'k', 'v')).toBe(true);
    expect(safeGetItem(localStorage, 'k')).toBe('v');
  });

  it('returns null for missing keys', () => {
    expect(safeGetItem(localStorage, 'missing')).toBeNull();
  });

  it('removes values', () => {
    safeSetItem(localStorage, 'k', 'v');
    safeRemoveItem(localStorage, 'k');
    expect(safeGetItem(localStorage, 'k')).toBeNull();
  });

  it('does not throw on QuotaExceededError and invokes warning handler', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onWarning = vi.fn();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    const ok = safeSetItem(localStorage, 'big', 'x'.repeat(1024), onWarning);
    expect(ok).toBe(false);
    expect(onWarning).toHaveBeenCalledTimes(1);
    expect(onWarning.mock.calls[0][0]).toContain('quota exceeded');
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not throw on SecurityError (private browsing)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('The operation is insecure', 'SecurityError');
    });

    const ok = safeSetItem(localStorage, 'k', 'v');
    expect(ok).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not throw on generic errors', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const ok = safeSetItem(localStorage, 'k', 'v');
    expect(ok).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not throw when reading fails', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });

    expect(safeGetItem(localStorage, 'k')).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('classifies quota and security errors', () => {
    expect(isStorageQuotaError(new DOMException('q', 'QuotaExceededError'))).toBe(true);
    expect(isStorageQuotaError(new DOMException('s', 'SecurityError'))).toBe(true);
    expect(isStorageQuotaError(new Error('nope'))).toBe(false);
  });

  it('produces a human-readable warning message', () => {
    expect(storageWarningMessage('k', new DOMException('q', 'QuotaExceededError'))).toContain(
      'quota exceeded'
    );
    expect(storageWarningMessage('k', new Error('x'))).toContain('unavailable');
  });
});
