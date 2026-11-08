import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TOON_DEFAULTS, toonUniforms } from '@/lib/toonShader.ts';

type Schema = Record<string, unknown>;
const set = vi.fn();
let schema: Schema = {};

vi.mock('leva', () => ({
  button: vi.fn((onClick: () => void) => ({ onClick })),
  folder: vi.fn((content: Schema) => content),
  useControls: vi.fn((_: string, factory: () => Schema) => {
    schema = factory();

    return [{}, set];
  }),
}));

const { useToonControls } = await import('./useToonControls');

afterEach(() => {
  toonUniforms.uFlatSaturation.value = TOON_DEFAULTS.flatSaturation;
  toonUniforms.uWaveBands.value = TOON_DEFAULTS.waveBands;
});

describe('useToonControls', () => {
  it('exposes every cartoon value and writes changes straight to its uniform', () => {
    renderHook(() => useToonControls());
    const controls = Object.assign(
      {},
      schema.general,
      schema.avatar,
      schema.wave,
    ) as Record<string, { value: number; onChange: (v: number) => void }>;

    expect(Object.keys(controls).sort()).toEqual(
      Object.keys(TOON_DEFAULTS).sort(),
    );
    controls.flatSaturation.onChange(2);
    controls.waveBands.onChange(6);
    expect(toonUniforms.uFlatSaturation.value).toBe(2);
    expect(toonUniforms.uWaveBands.value).toBe(6);
  });

  it('resets to the defaults', () => {
    renderHook(() => useToonControls());
    (schema['Reset Cartoon Defaults'] as { onClick: () => void }).onClick();
    expect(set).toHaveBeenCalledWith(TOON_DEFAULTS);
  });
});
