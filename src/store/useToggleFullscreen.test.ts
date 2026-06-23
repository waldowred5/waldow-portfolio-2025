import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useToggleFullscreen } from './useToggleFullscreen';

beforeEach(() => {
  Object.defineProperty(document, 'fullscreenElement', {
    value: null,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(document.documentElement, 'requestFullscreen', {
    value: vi.fn().mockResolvedValue(undefined),
    configurable: true,
    writable: true,
  });
  Object.defineProperty(document, 'exitFullscreen', {
    value: vi.fn().mockResolvedValue(undefined),
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useToggleFullscreen', () => {
  it('starts not fullscreen', () => {
    const { result } = renderHook(() => useToggleFullscreen());
    expect(result.current.isFullscreen).toBe(false);
  });

  it('toggleFullscreen calls requestFullscreen when not fullscreen', async () => {
    const { result } = renderHook(() => useToggleFullscreen());
    await act(() => result.current.toggleFullscreen());
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    expect(result.current.isFullscreen).toBe(true);
  });

  it('toggleFullscreen calls exitFullscreen when already fullscreen', async () => {
    // requestFullscreen mock also sets fullscreenElement so exit condition is met
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: vi.fn().mockImplementation(() => {
        Object.defineProperty(document, 'fullscreenElement', {
          value: document.body,
          configurable: true,
        });

        return Promise.resolve();
      }),
      configurable: true,
    });

    const { result } = renderHook(() => useToggleFullscreen());
    await act(() => result.current.toggleFullscreen());
    expect(result.current.isFullscreen).toBe(true);

    await act(() => result.current.toggleFullscreen());
    expect(document.exitFullscreen).toHaveBeenCalled();
  });

  it('does not throw when requestFullscreen rejects', async () => {
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: vi.fn().mockRejectedValue(new Error('not allowed')),
      configurable: true,
    });
    const { result } = renderHook(() => useToggleFullscreen());
    await expect(
      act(() => result.current.toggleFullscreen()),
    ).resolves.not.toThrow();
  });

  it('does not throw when exitFullscreen rejects', async () => {
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: vi.fn().mockImplementation(() => {
        Object.defineProperty(document, 'fullscreenElement', {
          value: document.body,
          configurable: true,
        });

        return Promise.resolve();
      }),
      configurable: true,
    });
    Object.defineProperty(document, 'exitFullscreen', {
      value: vi.fn().mockRejectedValue(new Error('exit failed')),
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() => useToggleFullscreen());
    await act(() => result.current.toggleFullscreen());
    await expect(
      act(() => result.current.toggleFullscreen()),
    ).resolves.not.toThrow();
  });
});
