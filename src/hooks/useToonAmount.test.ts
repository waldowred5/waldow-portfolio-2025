import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { THEME_TRANSITION_DURATION } from '@/lib/constants.ts';
import { toonUniforms } from '@/lib/toonShader.ts';
import { useToonMode } from '@/store/useToonMode.ts';

const frameCallbacks: Array<(state: unknown, delta: number) => void> = [];

vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: (state: unknown, delta: number) => void) =>
    frameCallbacks.push(cb),
}));

const { useToonAmount } = await import('./useToonAmount');

const runFrame = (delta: number) => frameCallbacks.at(-1)?.({}, delta);

afterEach(() => {
  frameCallbacks.length = 0;
  toonUniforms.uToonAmount.value = 0;
  toonUniforms.uToonNoiseSeed.value = 0;
  useToonMode.setState({ isToon: false });
});

describe('useToonAmount', () => {
  it('spreads the shared amount in over the transition duration and back out', () => {
    renderHook(() => useToonAmount());
    useToonMode.setState({ isToon: true });
    runFrame(THEME_TRANSITION_DURATION / 2);
    expect(toonUniforms.uToonAmount.value).toBeCloseTo(0.5);
    runFrame(THEME_TRANSITION_DURATION);
    expect(toonUniforms.uToonAmount.value).toBe(1);

    useToonMode.setState({ isToon: false });
    runFrame(THEME_TRANSITION_DURATION / 4);
    expect(toonUniforms.uToonAmount.value).toBeCloseTo(0.75);
    runFrame(THEME_TRANSITION_DURATION);
    expect(toonUniforms.uToonAmount.value).toBe(0);
  });

  it('picks a new noise pattern per toggle but keeps it when reversing mid-transition', () => {
    renderHook(() => useToonAmount());
    useToonMode.setState({ isToon: true });
    runFrame(THEME_TRANSITION_DURATION / 2);
    const seed = toonUniforms.uToonNoiseSeed.value;
    expect(seed).not.toBe(0);

    useToonMode.setState({ isToon: false });
    runFrame(0.01);
    expect(toonUniforms.uToonNoiseSeed.value).toBe(seed);
  });
});
