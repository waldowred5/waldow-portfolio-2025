import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SCENE, useScene } from './useScene';

afterEach(() => {
  useScene.setState({ currentScene: SCENE.HERO });
});

describe('useScene', () => {
  it('starts on the HERO scene', () => {
    const { result } = renderHook(() => useScene());
    expect(result.current.currentScene).toBe(SCENE.HERO);
  });

  it('updateScene changes the current scene', () => {
    const { result } = renderHook(() => useScene());
    act(() => result.current.updateScene(SCENE.CODING));
    expect(result.current.currentScene).toBe(SCENE.CODING);
  });

  it('updateScene accepts arbitrary scene strings', () => {
    const { result } = renderHook(() => useScene());
    act(() => result.current.updateScene('CUSTOM_SCENE'));
    expect(result.current.currentScene).toBe('CUSTOM_SCENE');
  });
});
