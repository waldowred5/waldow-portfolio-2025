import ReactThreeTestRenderer from '@react-three/test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';
import { SCENE, useScene } from '@/store/useScene.ts';

vi.mock('leva', () => ({
  button: vi.fn(),
  folder: vi.fn((_: unknown, content: unknown) => content),
  useControls: vi.fn(() => [{ scene: SCENE.HERO, opacity: 1 }, vi.fn()]),
}));

vi.mock('@/components/scenes/Hero/Hero.tsx', () => ({
  Hero: () => <mesh name={'hero'} />,
}));

vi.mock('@/components/scenes/Coding.tsx', () => ({
  Coding: () => <mesh name={'coding'} />,
}));

// Import after mocks
const { SceneManager } = await import('./SceneManager');
const { useControls } = await import('leva');

afterEach(() => {
  useScene.setState({ currentScene: SCENE.HERO });
  useCanvasLoaded.setState({ isGlowFading: false });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (vi.mocked(useControls) as any).mockReturnValue([
    { scene: SCENE.HERO, opacity: 1 },
    vi.fn(),
  ]);
});

describe('SceneManager', () => {
  it('renders hero scene by default', async () => {
    const renderer = await ReactThreeTestRenderer.create(<SceneManager />);
    const mesh = renderer.scene.findByProps({ name: 'hero' });
    expect(mesh).toBeTruthy();
  });

  it('does not mount the coding scene before the hero has loaded', async () => {
    const renderer = await ReactThreeTestRenderer.create(<SceneManager />);
    expect(() => renderer.scene.findByProps({ name: 'coding' })).toThrow();
  });

  it('mounts the coding scene once the hero has loaded', async () => {
    useCanvasLoaded.setState({ isGlowFading: true });
    const renderer = await ReactThreeTestRenderer.create(<SceneManager />);
    expect(renderer.scene.findByProps({ name: 'coding' })).toBeTruthy();
  });

  it('mounts the coding scene when it is the current scene', async () => {
    useScene.setState({ currentScene: SCENE.CODING });
    const renderer = await ReactThreeTestRenderer.create(<SceneManager />);
    expect(renderer.scene.findByProps({ name: 'coding' })).toBeTruthy();
  });

  it('falls back to hero scene for unknown scene value', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vi.mocked(useControls) as any).mockReturnValue([
      { scene: 'UNKNOWN', opacity: 1 },
      vi.fn(),
    ]);

    const renderer = await ReactThreeTestRenderer.create(<SceneManager />);
    const mesh = renderer.scene.findByProps({ name: 'hero' });
    expect(mesh).toBeTruthy();
  });
});
