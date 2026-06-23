import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useCanvasLoaded } from './useCanvasLoaded';

const initialState = {
  isLoaded: false,
  isCanvasReady: false,
  isFontsReady: false,
  isGlowFading: false,
};

afterEach(() => {
  useCanvasLoaded.setState(initialState);
});

describe('useCanvasLoaded', () => {
  it('starts with all flags false', () => {
    const { result } = renderHook(() => useCanvasLoaded());
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isCanvasReady).toBe(false);
    expect(result.current.isFontsReady).toBe(false);
    expect(result.current.isGlowFading).toBe(false);
  });

  it('setCanvasReady alone does not set isLoaded', () => {
    const { result } = renderHook(() => useCanvasLoaded());
    act(() => result.current.setCanvasReady());
    expect(result.current.isCanvasReady).toBe(true);
    expect(result.current.isLoaded).toBe(false);
  });

  it('setFontsReady alone does not set isLoaded', () => {
    const { result } = renderHook(() => useCanvasLoaded());
    act(() => result.current.setFontsReady());
    expect(result.current.isFontsReady).toBe(true);
    expect(result.current.isLoaded).toBe(false);
  });

  it('isLoaded is true when both canvas and fonts are ready', () => {
    const { result } = renderHook(() => useCanvasLoaded());
    act(() => result.current.setCanvasReady());
    act(() => result.current.setFontsReady());
    expect(result.current.isLoaded).toBe(true);
  });

  it('isLoaded is true when fonts ready before canvas', () => {
    const { result } = renderHook(() => useCanvasLoaded());
    act(() => result.current.setFontsReady());
    act(() => result.current.setCanvasReady());
    expect(result.current.isLoaded).toBe(true);
  });

  it('setGlowFading sets isGlowFading', () => {
    const { result } = renderHook(() => useCanvasLoaded());
    act(() => result.current.setGlowFading());
    expect(result.current.isGlowFading).toBe(true);
  });
});
