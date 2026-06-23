import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { button, folder, useControls } from 'leva';
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { JSX } from 'react/jsx-runtime';
import type { Group, Object3D } from 'three';
import * as THREE from 'three';

type MouseProps = JSX.IntrinsicElements['group'] & {
  hips: Group;
};

const HAND_BONE_NAME = 'RightHand';
const LERP_FACTOR = 0.15;

export const Mouse_LEGACY = ({ hips, ...props }: MouseProps) => {
  const groupRef = useRef<Group>(null);
  const handBoneRef = useRef<Object3D | null>(null);
  const mouseHomePosRef = useRef(new THREE.Vector3(1.2, 0.45, -0.4));
  const tempHandPos = useRef(new THREE.Vector3());
  const mouseTargetPos = useRef(new THREE.Vector3());

  const defaultValues = {
    mouseHomePos: { x: 1.2, y: 0.45, z: -0.4 },
    followThreshold: 0.5,
    mouseScale: 0.08,
    mouseRotation: { x: 0, y: 0, z: 0 },
  };

  const [{ mouseHomePos, followThreshold, mouseScale, mouseRotation }, set] =
    useControls('Coding Scene', () => ({
      mouse: folder(
        {
          'Reset Mouse Defaults': button(() => set(defaultValues)),
          mouseHomePos: {
            x: defaultValues.mouseHomePos.x,
            y: defaultValues.mouseHomePos.y,
            z: defaultValues.mouseHomePos.z,
          },
          followThreshold: {
            value: defaultValues.followThreshold,
            min: 0.01,
            max: 3,
            step: 0.01,
          },
          mouseScale: {
            value: defaultValues.mouseScale,
            min: 0.01,
            max: 0.5,
            step: 0.01,
          },
          mouseRotation: {
            x: defaultValues.mouseRotation.x,
            y: defaultValues.mouseRotation.y,
            z: defaultValues.mouseRotation.z,
          },
        },
        { collapsed: false },
      ),
    }));

  useEffect(() => {
    mouseHomePosRef.current.set(mouseHomePos.x, mouseHomePos.y, mouseHomePos.z);
  }, [mouseHomePos]);

  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(mouseHomePosRef.current);
    }
  }, []);

  useEffect(() => {
    hips.traverse((obj) => {
      if (obj.name === HAND_BONE_NAME) {
        handBoneRef.current = obj;
      }
    });
    if (!handBoneRef.current) {
      const boneNames: string[] = [];
      hips.traverse((obj) => boneNames.push(obj.name));
      console.warn(
        `Mouse: bone "${HAND_BONE_NAME}" not found. Available:`,
        boneNames,
      );
    }
  }, [hips]);

  useFrame(() => {
    if (!handBoneRef.current || !groupRef.current) {
      return;
    }

    handBoneRef.current.getWorldPosition(tempHandPos.current);
    const dist = tempHandPos.current.distanceTo(mouseHomePosRef.current);

    if (dist < followThreshold) {
      // Slide on desk plane — follow hand X/Z, keep home Y
      mouseTargetPos.current.set(
        tempHandPos.current.x,
        mouseHomePosRef.current.y,
        tempHandPos.current.z,
      );
    } else {
      mouseTargetPos.current.copy(mouseHomePosRef.current);
    }

    groupRef.current.position.lerp(mouseTargetPos.current, LERP_FACTOR);
  });

  return (
    <group
      {...props}
      ref={groupRef}
      rotation={[mouseRotation.x, mouseRotation.y, mouseRotation.z]}
      scale={mouseScale}
    >
      {/* Body */}
      <RoundedBox args={[1.2, 0.4, 1.8]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color={'#222222'} />
      </RoundedBox>
      {/* Left button */}
      <RoundedBox
        args={[0.5, 0.08, 0.7]}
        radius={0.05}
        smoothness={4}
        position={[-0.3, 0.23, -0.3]}
      >
        <meshStandardMaterial color={'#333333'} />
      </RoundedBox>
      {/* Right button */}
      <RoundedBox
        args={[0.5, 0.08, 0.7]}
        radius={0.05}
        smoothness={4}
        position={[0.3, 0.23, -0.3]}
      >
        <meshStandardMaterial color={'#333333'} />
      </RoundedBox>
      {/* Scroll wheel */}
      <mesh position={[0, 0.26, -0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.25, 16]} />
        <meshStandardMaterial color={'#555555'} />
      </mesh>
    </group>
  );
};
