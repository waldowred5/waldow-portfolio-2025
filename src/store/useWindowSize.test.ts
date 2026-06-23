import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useWindowSize } from './useWindowSize';

afterEach(() => {
  useWindowSize.setState({ innerHeight: 0, innerWidth: 0 });
});

describe('useWindowSize', () => {
  it('updateWindowSize sets height and width', () => {
    const { result } = renderHook(() => useWindowSize());
    act(() => result.current.updateWindowSize(900, 1440));
    expect(result.current.innerHeight).toBe(900);
    expect(result.current.innerWidth).toBe(1440);
  });

  it('updateWindowSize can be called multiple times', () => {
    const { result } = renderHook(() => useWindowSize());
    act(() => result.current.updateWindowSize(600, 800));
    act(() => result.current.updateWindowSize(1080, 1920));
    expect(result.current.innerHeight).toBe(1080);
    expect(result.current.innerWidth).toBe(1920);
  });
});
