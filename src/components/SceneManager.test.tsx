import ReactThreeTestRenderer from '@react-three/test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  vi.mocked(useControls).mockReturnValue([
    { scene: SCENE.HERO, opacity: 1 },
    vi.fn(),
  ] as never);
});

describe('SceneManager', () => {
  it('renders hero scene by default', async () => {
    const renderer = await ReactThreeTestRenderer.create(<SceneManager />);
    const mesh = renderer.scene.findByProps({ name: 'hero' });
    expect(mesh).toBeTruthy();
  });

  it('renders coding scene when leva scene is CODING', async () => {
    vi.mocked(useControls).mockReturnValue([
      { scene: SCENE.CODING, opacity: 1 },
      vi.fn(),
    ] as never);

    const renderer = await ReactThreeTestRenderer.create(<SceneManager />);
    const mesh = renderer.scene.findByProps({ name: 'coding' });
    expect(mesh).toBeTruthy();
  });

  it('falls back to hero scene for unknown scene value', async () => {
    vi.mocked(useControls).mockReturnValue([
      { scene: 'UNKNOWN', opacity: 1 },
      vi.fn(),
    ] as never);

    const renderer = await ReactThreeTestRenderer.create(<SceneManager />);
    const mesh = renderer.scene.findByProps({ name: 'hero' });
    expect(mesh).toBeTruthy();
  });
});
