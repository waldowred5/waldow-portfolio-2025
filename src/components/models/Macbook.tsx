import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import type { JSX } from 'react/jsx-runtime';
import type { MeshStandardMaterial } from 'three';
import type { Group, Mesh } from 'three';
import type { GLTF } from 'three-stdlib';

type NodeMeshes = {
  Circle001: Mesh;
  Circle001_1: Mesh;
  Circle001_2: Mesh;
  Circle001_3: Mesh;
  Circle001_4: Mesh;
  Circle001_5: Mesh;
  Circle001_6: Mesh;
  FrontCameraRing001: Mesh;
  KeyboardKeyHole: Mesh;
  RubberFoot: Mesh;
  Circle012: Mesh;
  Circle012_1: Mesh;
  Circle006: Mesh;
  Circle006_1: Mesh;
  Circle: Mesh;
  Circle_1: Mesh;
  Circle_2: Mesh;
  Circle002: Mesh;
  Circle002_1: Mesh;
  Circle002_2: Mesh;
  Circle002_3: Mesh;
  Circle002_4: Mesh;
  AppleLogo000: Mesh;
  Circle009: Mesh;
  Circle009_1: Mesh;
  Circle003: Mesh;
  Circle003_1: Mesh;
};

type GLTFResult = GLTF & {
  nodes: NodeMeshes;
  meshes: NodeMeshes;
  materials: {
    ['Frame.001']: MeshStandardMaterial;
    HeadPhoneHole: MeshStandardMaterial;
    USB_C_INSIDE: MeshStandardMaterial;
    TouchbarBorder: MeshStandardMaterial;
    Keyboard: MeshStandardMaterial;
    ['CameraRIngBlack.002']: MeshStandardMaterial;
    ['Keyboard.001']: MeshStandardMaterial;
    DarkRubber: MeshStandardMaterial;
    HingeBlack: MeshStandardMaterial;
    HingeMetal: MeshStandardMaterial;
    Key: MeshStandardMaterial;
    Touchbar: MeshStandardMaterial;
    Screen: MeshStandardMaterial;
    ScreenGlass: MeshStandardMaterial;
    Rubber: MeshStandardMaterial;
    DisplayGlass: MeshStandardMaterial;
    ['AppleLogo.004']: MeshStandardMaterial;
    SpeakerHole: MeshStandardMaterial;
  };
};

export const Macbook = (props: JSX.IntrinsicElements['group']) => {
  // @ts-expect-error ...
  const group = useRef<Group>();
  const { nodes, materials } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf',
  ) as GLTFResult;

  return (
    <group ref={group} {...props} dispose={null}>
      {props.children}
      <group position={[0, 0.52, 0]} scale={[0.1, 0.1, 0.1]}>
        <mesh
          geometry={nodes.Circle001.geometry}
          material={nodes.Circle001.material}
        />
        <mesh
          geometry={nodes.Circle001_1.geometry}
          material={nodes.Circle001_1.material}
        />
        <mesh
          geometry={nodes.Circle001_2.geometry}
          material={materials.HeadPhoneHole}
        />
        <mesh
          geometry={nodes.Circle001_3.geometry}
          material={nodes.Circle001_3.material}
        />
        <mesh
          geometry={nodes.Circle001_4.geometry}
          material={nodes.Circle001_4.material}
        />
        <mesh
          geometry={nodes.Circle001_5.geometry}
          material={materials.TouchbarBorder}
        />
        <mesh
          geometry={nodes.Circle001_6.geometry}
          material={materials.Keyboard}
        />
        <mesh
          geometry={nodes.FrontCameraRing001.geometry}
          material={materials['CameraRIngBlack.002']}
          position={[-0.15, 19.57, -16.15]}
          scale={5.8}
        />
        <mesh
          geometry={nodes.KeyboardKeyHole.geometry}
          material={nodes.KeyboardKeyHole.material}
          position={[-11.79, -0.15, -8.3]}
          scale={5.8}
        />
        <mesh
          geometry={nodes.RubberFoot.geometry}
          material={materials.DarkRubber}
          position={[-11.95, -0.75, 7.86]}
          scale={5.8}
        />
        <group position={[0.01, -0.21, -10.56]} scale={5.8}>
          <mesh
            geometry={nodes.Circle012.geometry}
            material={materials.HingeBlack}
          />
          <mesh
            geometry={nodes.Circle012_1.geometry}
            material={materials.HingeMetal}
          />
        </group>
        <group position={[0, -0.51, 0]} scale={5.8}>
          <mesh
            geometry={nodes.Circle006.geometry}
            material={nodes.Circle006.material}
          />
          <mesh
            geometry={nodes.Circle006_1.geometry}
            material={nodes.Circle006_1.material}
          />
        </group>
        <group position={[-11.79, -0.15, -8.3]} scale={5.8}>
          <mesh
            geometry={nodes.Circle.geometry}
            material={nodes.Circle.material}
          />
          <mesh geometry={nodes.Circle_1.geometry} material={materials.Key} />
          <mesh
            geometry={nodes.Circle_2.geometry}
            material={materials.Touchbar}
          />
        </group>
        <group
          position={[0.01, -0.47, -10.41]}
          rotation={[1.31, 0, 0]}
          scale={5.8}
        >
          <mesh
            geometry={nodes.Circle002.geometry}
            material={nodes.Circle002.material}
          />
          <mesh
            geometry={nodes.Circle002_1.geometry}
            material={materials.Screen}
          />
          <mesh
            geometry={nodes.Circle002_2.geometry}
            material={materials.ScreenGlass}
          />
          <mesh
            geometry={nodes.Circle002_3.geometry}
            material={materials.Rubber}
          />
          <mesh
            geometry={nodes.Circle002_4.geometry}
            material={materials.DisplayGlass}
          />
          <mesh
            geometry={nodes.AppleLogo000.geometry}
            material={materials['AppleLogo.004']}
            position={[0, -0.12, -1.8]}
            rotation={[-Math.PI, Math.PI, -Math.PI]}
            scale={[0.58, 0.58, 0.58]}
          />
        </group>
        <group position={[-15.03, 0.03, 0.6]} scale={5.8}>
          <mesh
            geometry={nodes.Circle009.geometry}
            material={nodes.Circle009.material}
          />
          <mesh
            geometry={nodes.Circle009_1.geometry}
            material={nodes.Circle009_1.material}
          />
        </group>
        <group position={[12.2, 0.03, 0.6]} scale={5.8}>
          <mesh
            geometry={nodes.Circle003.geometry}
            material={nodes.Circle003.material}
          />
          <mesh
            geometry={nodes.Circle003_1.geometry}
            material={nodes.Circle003_1.material}
          />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload(
  'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf',
);
