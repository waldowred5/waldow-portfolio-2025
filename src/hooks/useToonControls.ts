import { button, folder, useControls } from 'leva';
import type { Uniform } from 'three';

import { TOON_DEFAULTS, toonUniforms } from '@/lib/toonShader.ts';

type ToonKey = keyof typeof TOON_DEFAULTS;

interface ToonControl {
  key: ToonKey;
  uniform: Uniform<number>;
  label: string;
  min: number;
  max: number;
  step: number;
}

const control = (
  key: ToonKey,
  uniform: Uniform<number>,
  label: string,
  [min, max, step]: [number, number, number],
): ToonControl => ({ key, uniform, label, min, max, step });

const TOON_CONTROL_GROUPS: Record<string, ToonControl[]> = {
  general: [
    control(
      'outlineWidth',
      toonUniforms.uOutlineWidth,
      'Outline Width (px)',
      [0, 10, 0.1],
    ),
    control(
      'inkEdge',
      toonUniforms.uInkEdge,
      'Transition Ink Width',
      [0, 0.2, 0.005],
    ),
    control('celBands', toonUniforms.uCelBands, 'Model Light Bands', [1, 8, 1]),
  ],
  avatar: [
    control(
      'flatShadow',
      toonUniforms.uFlatShadow,
      'Shadow Brightness',
      [0, 1.5, 0.01],
    ),
    control('flatLit', toonUniforms.uFlatLit, 'Lit Brightness', [0, 1.5, 0.01]),
    control(
      'flatHighlight',
      toonUniforms.uFlatHighlight,
      'Highlight Boost',
      [0, 1, 0.01],
    ),
    control(
      'flatShadowThreshold',
      toonUniforms.uFlatShadowThreshold,
      'Shadow Threshold',
      [0, 1, 0.01],
    ),
    control(
      'flatHighlightThreshold',
      toonUniforms.uFlatHighlightThreshold,
      'Highlight Threshold',
      [0, 2, 0.01],
    ),
    control(
      'flatSaturation',
      toonUniforms.uFlatSaturation,
      'Saturation',
      [0, 3, 0.05],
    ),
    control(
      'flatColourSteps',
      toonUniforms.uFlatColourSteps,
      'Colour Steps',
      [2, 32, 1],
    ),
    control(
      'flatMatte',
      toonUniforms.uFlatMatte,
      'Reflection Removal',
      [0, 1, 0.01],
    ),
    control(
      'flatOutlineScale',
      toonUniforms.uFlatOutlineScale,
      'Outline Scale',
      [0, 4, 0.05],
    ),
  ],
  wave: [
    control('waveBands', toonUniforms.uWaveBands, 'Colour Bands', [1, 16, 1]),
    control(
      'waveEdgeMin',
      toonUniforms.uWaveEdgeMin,
      'Edge Threshold Min',
      [0, 0.3, 0.005],
    ),
    control(
      'waveEdgeMax',
      toonUniforms.uWaveEdgeMax,
      'Edge Threshold Max',
      [0, 0.3, 0.005],
    ),
  ],
};

const toonFolder = (controls: ToonControl[]) =>
  folder(
    Object.fromEntries(
      controls.map(({ key, uniform, label, min, max, step }) => [
        key,
        {
          value: TOON_DEFAULTS[key],
          label,
          min,
          max,
          step,
          onChange: (value: number) => {
            uniform.value = value;
          },
        },
      ]),
    ),
    { collapsed: true },
  );

// Leva panel for the cartoon look. Writes straight to the shared uniforms, so tweaks apply live without re-rendering or recompiling.
export const useToonControls = () => {
  const [, set] = useControls(
    'Cartoon',
    () => ({
      'Reset Cartoon Defaults': button(() => set(TOON_DEFAULTS)),
      ...Object.fromEntries(
        Object.entries(TOON_CONTROL_GROUPS).map(([name, controls]) => [
          name,
          toonFolder(controls),
        ]),
      ),
    }),
    { collapsed: true },
  );
};
