import ReactThreeTestRenderer from '@react-three/test-renderer';
import type { BufferGeometry, Mesh, ShaderMaterial } from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { THEME, useTheme } from '@/store/useTheme.ts';
import { useViewMode, VIEW_MODE } from '@/store/useViewMode.ts';

vi.mock('leva', () => ({
  button: vi.fn(),
  folder: vi.fn((_: unknown, content: unknown) => content),
  useControls: vi.fn(() => [
    {
      radius: 4,
      sunPosition: { x: 0, y: 0, z: -3 },
      sunXPositionMouseXFactor: 1400,
      sunYPositionMouseYFactor: 3600,
      wavePosition: { x: 0.5, y: -0.5, z: 3.5 },
      waveRotation: { x: -Math.PI * 0.4, y: 0, z: Math.PI * 0.55 },
      waveXRotationMouseYFactor: 3750,
      waveYRotationMouseXFactor: 15000,
      htmlPosition: { x: 0, y: 0, z: 0.5 },
    },
    vi.fn(),
  ]),
}));

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: () => null,
  Bloom: () => null,
}));

vi.mock('@react-three/drei', () => ({
  Html: () => null,
}));

vi.mock('@/store/useMousePosition.ts', () => ({
  useMousePosition: () => ({ x: 0, y: 0 }),
  PARALLAX_X_FACTOR: -0.05,
  PARALLAX_Y_FACTOR: 0.02,
}));

const { Hero } = await import('./Hero');

afterEach(() => {
  useTheme.setState({ theme: THEME.ELECTRIC_BLUE });
  useViewMode.setState({ viewMode: VIEW_MODE.FULL });
});

describe('Hero', () => {
  it('renders two meshes (sun and wave)', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Hero />);
    const meshes = renderer.scene.findAllByType('Mesh');
    expect(meshes.length).toBeGreaterThanOrEqual(2);
  });

  it('sun mesh has a shader material with uOpacity uniform', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Hero />);
    const meshes = renderer.scene.findAllByType('Mesh');
    const sunMesh = meshes[0];
    const mat = (sunMesh.instance as Mesh<BufferGeometry, ShaderMaterial>)
      .material;
    expect(mat.uniforms).toBeDefined();
    expect(mat.uniforms.uOpacity).toBeDefined();
  });

  it('renders without crashing with opacity prop', async () => {
    await expect(
      ReactThreeTestRenderer.create(<Hero opacity={0.5} />),
    ).resolves.toBeDefined();
  });
});

describe('Hero useFrame transitions', () => {
  beforeEach(() => {
    useTheme.setState({ theme: THEME.ELECTRIC_BLUE });
    useViewMode.setState({ viewMode: VIEW_MODE.FULL });
  });

  afterEach(() => {
    useTheme.setState({ theme: THEME.ELECTRIC_BLUE });
    useViewMode.setState({ viewMode: VIEW_MODE.FULL });
  });

  it('randomises noise seed when viewMode changes to WIREFRAME', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Hero />);
    const meshes = renderer.scene.findAllByType('Mesh');
    const sunMesh = meshes[0];
    const mat = (sunMesh.instance as Mesh<BufferGeometry, ShaderMaterial>)
      .material;

    expect(mat.uniforms.uNoiseSeed.value).toBe(42);

    useViewMode.setState({ viewMode: VIEW_MODE.WIREFRAME });
    await renderer.advanceFrames(1, 0);

    expect(mat.uniforms.uNoiseSeed.value).not.toBe(42);
  });

  it('randomises noise seed when theme changes', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Hero />);
    const meshes = renderer.scene.findAllByType('Mesh');
    const waveMesh = meshes[1];
    const waveMat = (waveMesh.instance as Mesh<BufferGeometry, ShaderMaterial>)
      .material;

    expect(waveMat.uniforms.uNoiseSeed.value).toBe(42);

    useTheme.setState({ theme: THEME.FIRE });
    await renderer.advanceFrames(1, 0);

    expect(waveMat.uniforms.uNoiseSeed.value).not.toBe(42);
  });

  it('updates sun color uniform when theme changes', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Hero />);
    const meshes = renderer.scene.findAllByType('Mesh');
    const sunMesh = meshes[0];
    const mat = (sunMesh.instance as Mesh<BufferGeometry, ShaderMaterial>)
      .material;

    const initialColorR = mat.uniforms.uColor.value.r;

    useTheme.setState({ theme: THEME.FIRE });
    await renderer.advanceFrames(1, 0);

    // FIRE tertiary differs from ELECTRIC_BLUE tertiary
    expect(mat.uniforms.uColor.value.r).not.toBe(initialColorR);
  });
});
