import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { THEME, useTheme } from './useTheme';

afterEach(() => {
  useTheme.setState({ theme: THEME.ELECTRIC_BLUE });
});

describe('useTheme', () => {
  it('starts on ELECTRIC_BLUE', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe(THEME.ELECTRIC_BLUE);
  });

  it('toggleTheme advances to the next theme', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe(THEME.FIRE);
  });

  it('toggleTheme cycles through all themes without throwing', () => {
    const { result } = renderHook(() => useTheme());
    const themeCount = Object.values(THEME).filter(
      (v) => typeof v === 'number',
    ).length;
    for (let i = 0; i < themeCount; i++) {
      act(() => result.current.toggleTheme());
    }
    expect(result.current.theme).toBe(THEME.ELECTRIC_BLUE);
  });

  it('wraps back to ELECTRIC_BLUE after last theme', () => {
    const { result } = renderHook(() => useTheme());
    const lastTheme = THEME.GREEN;
    useTheme.setState({ theme: lastTheme });
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe(THEME.ELECTRIC_BLUE);
  });
});
