import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SCENE_FADE_DURATION_MS } from '@/lib/constants.ts';

import { SCENE, useScene } from './useScene';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  useScene.setState({
    currentScene: SCENE.HERO,
    pendingScene: null,
    isFadedOut: false,
  });
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

  it('requestScene switches from the hero immediately without fading', () => {
    useScene.getState().requestScene(SCENE.CODING);
    expect(useScene.getState()).toMatchObject({
      currentScene: SCENE.CODING,
      isFadedOut: false,
    });
  });

  it('leaving the coding scene waits for commitScene', () => {
    useScene.setState({ currentScene: SCENE.CODING });
    useScene.getState().requestScene(SCENE.HERO);
    expect(useScene.getState()).toMatchObject({
      currentScene: SCENE.CODING,
      pendingScene: SCENE.HERO,
      isFadedOut: false,
    });
  });

  it('commitScene fades to black, swaps, then fades back in', () => {
    useScene.setState({ currentScene: SCENE.CODING, pendingScene: SCENE.HERO });
    useScene.getState().commitScene();
    expect(useScene.getState()).toMatchObject({
      currentScene: SCENE.CODING,
      isFadedOut: true,
    });

    vi.advanceTimersByTime(SCENE_FADE_DURATION_MS);
    expect(useScene.getState()).toMatchObject({
      currentScene: SCENE.HERO,
      pendingScene: null,
      isFadedOut: false,
    });
  });

  it('commitScene ignores repeat calls while faded out', () => {
    useScene.setState({ currentScene: SCENE.CODING, pendingScene: SCENE.HERO });
    useScene.getState().commitScene();
    useScene.setState({ pendingScene: 'OTHER' });
    useScene.getState().commitScene();
    vi.advanceTimersByTime(SCENE_FADE_DURATION_MS);
    expect(useScene.getState().currentScene).toBe(SCENE.HERO);
  });

  it('commitScene does nothing without a pending scene', () => {
    useScene.getState().commitScene();
    expect(useScene.getState().isFadedOut).toBe(false);
  });

  it('requestScene does nothing for the current scene', () => {
    useScene.getState().requestScene(SCENE.HERO);
    expect(useScene.getState().currentScene).toBe(SCENE.HERO);
  });
});
