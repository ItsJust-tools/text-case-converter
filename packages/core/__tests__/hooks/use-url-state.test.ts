import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUrlState } from '../../src/hooks/use-url-state';

const originalLocation = window.location;
const originalHistory = window.history;
const originalNavigator = navigator;

function setUrl(url: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: new URL(url),
  });
}

function mockShare(rejectWith?: unknown) {
  Object.defineProperty(navigator, 'share', {
    configurable: true,
    value: rejectWith
      ? vi.fn().mockRejectedValue(rejectWith)
      : vi.fn().mockResolvedValue(undefined),
  });
}

describe('useUrlState', () => {
  const toolId = 'my-tool';

  const options = () => ({
    toolId,
    serialize: () => JSON.stringify({ text: 'hello' }),
    deserialize: vi.fn((data: unknown) => ({ success: true as const, data })),
    onStateLoaded: vi.fn(),
    showToast: vi.fn(),
  });

  beforeEach(() => {
    setUrl('https://itsjust.tools/test');
    vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
    Object.defineProperty(window, 'history', {
      configurable: true,
      value: originalHistory,
    });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: originalNavigator.share,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalNavigator.clipboard,
    });
    vi.restoreAllMocks();
  });

  it('suppresses AbortError from user-cancelled share dialog and returns the URL', async () => {
    mockShare(Object.assign(new Error('Share canceled'), { name: 'AbortError' }));
    const opts = options();
    const { result } = renderHook(() => useUrlState(opts));

    let url: string | null = '';
    await act(async () => {
      url = await result.current.createShareUrl('Share title');
    });

    // AbortError is expected user behaviour — URL still returned, no toast fired at all.
    expect(url).toBeTruthy();
    expect(opts.showToast).not.toHaveBeenCalled();
  });

  it('returns URL from clipboard when Web Share API is not supported', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    const opts = options();
    const { result } = renderHook(() => useUrlState(opts));

    let url: string | null = '';
    await act(async () => {
      url = await result.current.createShareUrl();
    });

    expect(url).toBeTruthy();
    expect(navigator.clipboard.writeText as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalled();
  });

  it('reports unexpected share errors via error toast and returns null', async () => {
    mockShare(new Error('NotAllowedError'));
    const opts = options();
    const { result } = renderHook(() => useUrlState(opts));

    let url: string | null = 'not-null';
    await act(async () => {
      url = await result.current.createShareUrl('Share title');
    });

    expect(url).toBeNull();
    expect(opts.showToast).toHaveBeenCalledWith('NotAllowedError', 'error');
  });
});
