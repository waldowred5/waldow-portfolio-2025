import { renderHook } from '@testing-library/react';
import {
  ACESFilmicToneMapping,
  Group,
  Mesh,
  MeshStandardMaterial,
  NoToneMapping,
  PerspectiveCamera,
  Scene,
  Texture,
  type ToneMapping,
  WebGLRenderTarget,
} from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const frameCallbacks: Array<() => void> = [];
const gl = {
  toneMapping: NoToneMapping as ToneMapping,
  compileAsync: vi.fn(),
  initTexture: vi.fn(),
  getRenderTarget: vi.fn(() => null),
  setRenderTarget: vi.fn(),
};
const scene = new Scene();
const camera = new PerspectiveCamera();

vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: () => void) => frameCallbacks.push(cb),
  useThree: () => ({ gl, scene, camera }),
}));

const { usePrewarmScene } = await import('./usePrewarmScene');

const runFrame = () => frameCallbacks.at(-1)?.();
const flushPromises = () => new Promise((r) => setTimeout(r, 0));

const buildGraph = () => {
  const map = new Texture();
  const normalMap = new Texture();
  const target = new Group();
  target.visible = false;
  target.add(
    new Mesh(undefined, new MeshStandardMaterial({ map, normalMap })),
    new Mesh(undefined, [new MeshStandardMaterial({ map })]),
  );
  const hidden = new Group();

  return { target, hidden, textures: [map, normalMap] };
};

beforeEach(() => {
  frameCallbacks.length = 0;
  gl.compileAsync.mockReset().mockResolvedValue(undefined);
  gl.initTexture.mockReset();
  gl.setRenderTarget.mockReset();
});

describe('usePrewarmScene', () => {
  it('compiles a second pass against an offscreen render target, then restores the previous target', () => {
    const { target, hidden } = buildGraph();
    renderHook(() =>
      usePrewarmScene({
        enabled: true,
        targetRef: { current: target },
        hiddenRef: { current: hidden },
        toneMapping: ACESFilmicToneMapping,
        onComplete: vi.fn(),
      }),
    );
    runFrame();
    const [[offscreen], [restored]] = gl.setRenderTarget.mock.calls;
    expect(offscreen).toBeInstanceOf(WebGLRenderTarget);
    expect(restored).toBeNull();
  });

  it('does nothing while disabled', () => {
    const { target, hidden } = buildGraph();
    renderHook(() =>
      usePrewarmScene({
        enabled: false,
        targetRef: { current: target },
        hiddenRef: { current: hidden },
        toneMapping: ACESFilmicToneMapping,
        onComplete: vi.fn(),
      }),
    );
    runFrame();
    expect(gl.compileAsync).not.toHaveBeenCalled();
  });

  it('compiles with the target visible and the other scene hidden, then restores visibility', () => {
    const { target, hidden } = buildGraph();
    gl.compileAsync.mockImplementation(() => {
      expect(target.visible).toBe(true);
      expect(hidden.visible).toBe(false);
      expect(gl.toneMapping).toBe(ACESFilmicToneMapping);

      return Promise.resolve();
    });
    renderHook(() =>
      usePrewarmScene({
        enabled: true,
        targetRef: { current: target },
        hiddenRef: { current: hidden },
        toneMapping: ACESFilmicToneMapping,
        onComplete: vi.fn(),
      }),
    );
    runFrame();
    expect(gl.compileAsync).toHaveBeenCalledTimes(2);
    expect(gl.compileAsync).toHaveBeenCalledWith(scene, camera);
    expect(target.visible).toBe(false);
    expect(hidden.visible).toBe(true);
    expect(gl.toneMapping).toBe(NoToneMapping);
  });

  it('uploads each unique texture one per frame then completes', async () => {
    const { target, hidden, textures } = buildGraph();
    const onComplete = vi.fn();
    renderHook(() =>
      usePrewarmScene({
        enabled: true,
        targetRef: { current: target },
        hiddenRef: { current: hidden },
        toneMapping: ACESFilmicToneMapping,
        onComplete,
      }),
    );
    runFrame();
    runFrame();
    expect(gl.initTexture).not.toHaveBeenCalled();

    await flushPromises();
    runFrame();
    runFrame();
    expect(gl.initTexture.mock.calls.map(([t]) => t)).toEqual(textures);
    expect(onComplete).not.toHaveBeenCalled();

    runFrame();
    runFrame();
    expect(gl.compileAsync).toHaveBeenCalledTimes(2);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
