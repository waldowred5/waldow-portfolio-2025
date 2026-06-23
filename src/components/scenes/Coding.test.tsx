import ReactThreeTestRenderer from '@react-three/test-renderer';
import { describe, expect, it, vi } from 'vitest';

vi.mock('leva', () => ({
  button: vi.fn(),
  buttonGroup: vi.fn(),
  folder: vi.fn((_: unknown, content: unknown) => content),
  useControls: vi.fn(() => [
    {
      enableCameraControls: true,
      scenePosition: { x: 0, y: -0.8, z: 1 },
      sceneRotation: { x: 0.34, y: 0.42, z: 0 },
      deskPosition: { x: 0.8, y: 0.4, z: -0.7 },
      chairPosition: { x: 0.76, y: -3.09, z: 4.5 },
      portalSizeFactor: 1.14,
      portalPosition: { x: 0, y: 1.56, z: -1.36 },
      portalRotation: { x: -0.26, y: 0, z: 0 },
    },
    vi.fn(),
  ]),
}));

vi.mock('@react-three/drei', () => ({
  CameraControls: () => null,
  PerspectiveCamera: () => null,
  Environment: () => null,
  Html: () => null,
  RoundedBox: ({ children }: { children?: React.ReactNode }) => (
    <group>{children}</group>
  ),
}));

vi.mock('@/components/models/Macbook.tsx', () => ({
  Macbook: ({ children }: { children?: React.ReactNode }) => (
    <group name={'macbook'}>{children}</group>
  ),
}));

vi.mock('@/components/models/WaldowAvatar.tsx', () => ({
  WaldowAvatar: () => <group name={'avatar'} />,
}));

const { Coding } = await import('./Coding');

describe('Coding', () => {
  it('renders without crashing', async () => {
    await expect(
      ReactThreeTestRenderer.create(<Coding />),
    ).resolves.toBeDefined();
  });

  it('renders the macbook group', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Coding />);
    expect(renderer.scene.findByProps({ name: 'macbook' })).toBeTruthy();
  });

  it('renders the avatar group', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Coding />);
    expect(renderer.scene.findByProps({ name: 'avatar' })).toBeTruthy();
  });
});
