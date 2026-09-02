import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyTextToClipboard, copyWithExecCommand } from '../../src/lib/clipboard';

describe('clipboard helpers', () => {
  const originalClipboard = navigator.clipboard;
  const originalExecCommand = document.execCommand;

  beforeEach(() => {
    // jsdom does not implement navigator.clipboard by default.
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    // jsdom does not implement document.execCommand either; provide a stub.
    if (typeof document.execCommand !== 'function') {
      document.execCommand = vi.fn(() => false) as unknown as typeof document.execCommand;
    }
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
    document.execCommand = originalExecCommand;
    vi.restoreAllMocks();
  });

  it('returns false for empty input', async () => {
    await expect(copyTextToClipboard('')).resolves.toBe(false);
    await expect(copyTextToClipboard('   ')).resolves.toBe(false);
  });

  it('uses the async Clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    await expect(copyTextToClipboard('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when the async API rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const execSpy = vi.spyOn(document, 'execCommand').mockReturnValue(true);

    await expect(copyTextToClipboard('fallback')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('fallback');
    expect(execSpy).toHaveBeenCalledWith('copy');
  });

  it('falls back to execCommand when the async API is unavailable', async () => {
    const execSpy = vi.spyOn(document, 'execCommand').mockReturnValue(true);

    await expect(copyTextToClipboard('legacy')).resolves.toBe(true);
    expect(execSpy).toHaveBeenCalledWith('copy');
  });

  it('returns false when both paths fail', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    vi.spyOn(document, 'execCommand').mockReturnValue(false);

    await expect(copyTextToClipboard('nope')).resolves.toBe(false);
  });

  it('copyWithExecCommand removes the temporary textarea', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');
    vi.spyOn(document, 'execCommand').mockReturnValue(true);

    const result = copyWithExecCommand('temp');

    expect(result).toBe(true);
    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it('copyWithExecCommand cleans up even when execCommand throws', () => {
    const removeSpy = vi.spyOn(document.body, 'removeChild');
    vi.spyOn(document, 'execCommand').mockImplementation(() => {
      throw new Error('boom');
    });

    const result = copyWithExecCommand('temp');

    expect(result).toBe(false);
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});
