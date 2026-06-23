import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useMousePosition } from './useMousePosition';
import { useWindowSize } from './useWindowSize';

beforeEach(() => {
  useWindowSize.setState({ innerHeight: 600, innerWidth: 800 });
});

afterEach(() => {
  useWindowSize.setState({ innerHeight: 0, innerWidth: 0 });
});

describe('useMousePosition', () => {
  it('starts at origin', () => {
    const { result } = renderHook(() => useMousePosition());
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('updates position relative to window centre on mousemove', () => {
    const { result } = renderHook(() => useMousePosition());
    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 900, clientY: 700 }),
      );
    });
    // x = 900 - 800/2 = 500, y = 700 - 600/2 = 400
    expect(result.current.x).toBe(500);
    expect(result.current.y).toBe(400);
  });

  it('handles negative offset (mouse left/above centre)', () => {
    const { result } = renderHook(() => useMousePosition());
    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 200, clientY: 100 }),
      );
    });
    expect(result.current.x).toBe(-200);
    expect(result.current.y).toBe(-200);
  });

  it('updates on touchmove with 2x multiplier', () => {
    const { result } = renderHook(() => useMousePosition());
    act(() => {
      const evt = new Event('touchmove') as TouchEvent;
      Object.defineProperty(evt, 'touches', {
        value: [{ clientX: 900, clientY: 700 }],
      });
      window.dispatchEvent(evt);
    });
    // x = (900 - 400) * 2 = 1000, y = (700 - 300) * 2 = 800
    expect(result.current.x).toBe(1000);
    expect(result.current.y).toBe(800);
  });

  it('removes event listeners on unmount', () => {
    const { result, unmount } = renderHook(() => useMousePosition());
    unmount();
    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 999, clientY: 999 }),
      );
    });
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });
});
