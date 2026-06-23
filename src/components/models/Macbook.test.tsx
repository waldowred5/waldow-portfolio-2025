import ReactThreeTestRenderer from '@react-three/test-renderer';
import { BoxGeometry, MeshStandardMaterial } from 'three';
import { describe, expect, it, vi } from 'vitest';

const makeNode = () => ({
  geometry: new BoxGeometry(),
  material: new MeshStandardMaterial(),
});

const useGLTFMock = Object.assign(
  vi.fn(() => ({
    nodes: {
      Circle001: makeNode(),
      Circle001_1: makeNode(),
      Circle001_2: makeNode(),
      Circle001_3: makeNode(),
      Circle001_4: makeNode(),
      Circle001_5: makeNode(),
      Circle001_6: makeNode(),
      FrontCameraRing001: makeNode(),
      KeyboardKeyHole: makeNode(),
      RubberFoot: makeNode(),
      Circle012: makeNode(),
      Circle012_1: makeNode(),
      Circle006: makeNode(),
      Circle006_1: makeNode(),
      Circle: makeNode(),
      Circle_1: makeNode(),
      Circle_2: makeNode(),
      Circle002: makeNode(),
      Circle002_1: makeNode(),
      Circle002_2: makeNode(),
      Circle002_3: makeNode(),
      Circle002_4: makeNode(),
      AppleLogo000: makeNode(),
      Circle009: makeNode(),
      Circle009_1: makeNode(),
      Circle003: makeNode(),
      Circle003_1: makeNode(),
    },
    materials: {
      'Frame.001': new MeshStandardMaterial(),
      HeadPhoneHole: new MeshStandardMaterial(),
      USB_C_INSIDE: new MeshStandardMaterial(),
      TouchbarBorder: new MeshStandardMaterial(),
      Keyboard: new MeshStandardMaterial(),
      'CameraRIngBlack.002': new MeshStandardMaterial(),
      'Keyboard.001': new MeshStandardMaterial(),
      DarkRubber: new MeshStandardMaterial(),
      HingeBlack: new MeshStandardMaterial(),
      HingeMetal: new MeshStandardMaterial(),
      Key: new MeshStandardMaterial(),
      Touchbar: new MeshStandardMaterial(),
      Screen: new MeshStandardMaterial(),
      ScreenGlass: new MeshStandardMaterial(),
      Rubber: new MeshStandardMaterial(),
      DisplayGlass: new MeshStandardMaterial(),
      'AppleLogo.004': new MeshStandardMaterial(),
      SpeakerHole: new MeshStandardMaterial(),
    },
  })),
  { preload: vi.fn() },
);

vi.mock('@react-three/drei', () => ({ useGLTF: useGLTFMock }));

const { Macbook } = await import('./Macbook');

describe('Macbook', () => {
  it('renders all 27 model meshes', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Macbook />);
    expect(renderer.scene.findAllByType('Mesh').length).toBe(27);
  });

  it('renders children passed as props', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Macbook>
        <mesh name={'child-mesh'} />
      </Macbook>,
    );
    expect(renderer.scene.findByProps({ name: 'child-mesh' })).toBeTruthy();
  });
});
