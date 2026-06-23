import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useScroll } from './useScroll';

afterEach(() => {
  useScroll.setState({ scrollPercentage: 0 });
});

describe('useScroll', () => {
  it('starts at 0 scroll percentage', () => {
    const { result } = renderHook(() => useScroll());
    expect(result.current.scrollPercentage).toBe(0);
  });

  it('updateScrollPercentage updates the value', () => {
    const { result } = renderHook(() => useScroll());
    act(() => result.current.updateScrollPercentage(0.5));
    expect(result.current.scrollPercentage).toBe(0.5);
  });

  it('updateScrollPercentage accepts 0 and 1 boundary values', () => {
    const { result } = renderHook(() => useScroll());
    act(() => result.current.updateScrollPercentage(1));
    expect(result.current.scrollPercentage).toBe(1);
    act(() => result.current.updateScrollPercentage(0));
    expect(result.current.scrollPercentage).toBe(0);
  });
});
