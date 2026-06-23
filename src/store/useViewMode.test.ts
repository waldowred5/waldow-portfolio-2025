import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useViewMode, VIEW_MODE } from './useViewMode';

afterEach(() => {
  useViewMode.setState({ viewMode: VIEW_MODE.FULL });
});

describe('useViewMode', () => {
  it('starts in FULL mode', () => {
    const { result } = renderHook(() => useViewMode());
    expect(result.current.viewMode).toBe(VIEW_MODE.FULL);
  });

  it('toggleViewMode switches FULL → WIREFRAME', () => {
    const { result } = renderHook(() => useViewMode());
    act(() => result.current.toggleViewMode());
    expect(result.current.viewMode).toBe(VIEW_MODE.WIREFRAME);
  });

  it('toggleViewMode switches WIREFRAME → FULL', () => {
    const { result } = renderHook(() => useViewMode());
    act(() => result.current.toggleViewMode());
    act(() => result.current.toggleViewMode());
    expect(result.current.viewMode).toBe(VIEW_MODE.FULL);
  });
});
