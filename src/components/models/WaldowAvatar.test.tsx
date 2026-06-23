import ReactThreeTestRenderer from '@react-three/test-renderer';
import { BoxGeometry, Color, MeshStandardMaterial, Object3D } from 'three';
import { describe, expect, it, vi } from 'vitest';

const makeSkinnedNode = () => ({
  geometry: new BoxGeometry(),
  material: new MeshStandardMaterial(),
  skeleton: { bones: [] },
  morphTargetDictionary: {},
  morphTargetInfluences: [],
});

const mockMaterials = {
  Wolf3D_Hair: new MeshStandardMaterial(),
  Wolf3D_Outfit_Top: Object.assign(new MeshStandardMaterial(), {
    color: new Color(),
  }),
  Wolf3D_Outfit_Bottom: new MeshStandardMaterial(),
  Wolf3D_Outfit_Footwear: new MeshStandardMaterial(),
  Wolf3D_Body: new MeshStandardMaterial(),
  Wolf3D_Eye: new MeshStandardMaterial(),
  Wolf3D_Skin: new MeshStandardMaterial(),
  Wolf3D_Teeth: new MeshStandardMaterial(),
};

const mockAnimation = Object.assign(new Object3D(), {
  name: '',
  tracks: [],
  duration: 1,
});

const mockPlay = vi.fn();
const mockReset = vi.fn().mockReturnThis();

const useGLTFMock = Object.assign(
  vi.fn(() => ({
    nodes: {
      Hips: new Object3D(),
      Wolf3D_Hair: makeSkinnedNode(),
      Wolf3D_Outfit_Top: makeSkinnedNode(),
      Wolf3D_Outfit_Bottom: makeSkinnedNode(),
      Wolf3D_Outfit_Footwear: makeSkinnedNode(),
      Wolf3D_Body: makeSkinnedNode(),
      EyeLeft: makeSkinnedNode(),
      EyeRight: makeSkinnedNode(),
      Wolf3D_Head: makeSkinnedNode(),
      Wolf3D_Teeth: makeSkinnedNode(),
    },
    materials: mockMaterials,
  })),
  { preload: vi.fn() },
);

vi.mock('@react-three/drei', () => ({
  useGLTF: useGLTFMock,
  useFBX: vi.fn(() => ({ animations: [mockAnimation] })),
  useAnimations: vi.fn(() => ({
    actions: { TYPING: { reset: mockReset, play: mockPlay } },
  })),
}));

vi.mock('leva', () => ({
  button: vi.fn(),
  folder: vi.fn((_: unknown, content: unknown) => content),
  useControls: vi.fn(() => [
    {
      position: { x: 0.73, y: -4.84, z: 4.85 },
      rotation: { x: -Math.PI / 2, y: 0, z: Math.PI },
      scale: 7.8,
    },
    vi.fn(),
  ]),
}));

const { WaldowAvatar } = await import('./WaldowAvatar');

describe('WaldowAvatar', () => {
  it('renders all 9 skinned meshes', async () => {
    const renderer = await ReactThreeTestRenderer.create(<WaldowAvatar />);
    const skinned = renderer.scene.findAllByType('SkinnedMesh');
    expect(skinned.length).toBe(9);
  });

  it('named meshes render with correct identifiers', async () => {
    const renderer = await ReactThreeTestRenderer.create(<WaldowAvatar />);
    expect(renderer.scene.findByProps({ name: 'EyeLeft' })).toBeTruthy();
    expect(renderer.scene.findByProps({ name: 'EyeRight' })).toBeTruthy();
    expect(renderer.scene.findByProps({ name: 'Wolf3D_Head' })).toBeTruthy();
    expect(renderer.scene.findByProps({ name: 'Wolf3D_Teeth' })).toBeTruthy();
  });

  it('plays typing animation on mount', async () => {
    mockPlay.mockClear();
    await ReactThreeTestRenderer.create(<WaldowAvatar />);
    expect(mockPlay).toHaveBeenCalled();
  });
});
