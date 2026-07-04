import { RoundedBox } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import type { Color, Mesh, MeshPhysicalMaterial } from 'three';

import { useWireframeProgress } from '@/hooks/useWireframeProgress.ts';
import {
  addBarycentricCoords,
  applyWireframeShader,
  createWireframeUniforms,
} from '@/lib/wireframeShader.ts';

type Props = {
  position: [number, number, number];
  transmission: number;
  roughness: number;
  thickness: number;
  ior: number;
  clearcoat: number;
  attenuationDistance: number;
  attenuationColor: Color;
  color: string;
};

export const CodingChair = ({
  position,
  transmission,
  roughness,
  thickness,
  ior,
  clearcoat,
  attenuationDistance,
  attenuationColor,
  color,
}: Props) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const wireframeUniforms = useRef(createWireframeUniforms());

  useEffect(() => {
    if (!meshRef.current || !materialRef.current) {
      return;
    }
    meshRef.current.geometry = addBarycentricCoords(meshRef.current.geometry);
    applyWireframeShader(materialRef.current, wireframeUniforms.current);
    materialRef.current.needsUpdate = true;
  }, []);

  useWireframeProgress(wireframeUniforms.current);

  return (
    <RoundedBox
      ref={meshRef}
      args={[3.5, 3.5, 3.5]}
      radius={0.5}
      position={position}
    >
      <meshPhysicalMaterial
        ref={materialRef}
        transparent
        transmission={transmission}
        roughness={roughness}
        thickness={thickness}
        ior={ior}
        clearcoat={clearcoat}
        attenuationDistance={attenuationDistance}
        attenuationColor={attenuationColor}
        color={color}
      />
    </RoundedBox>
  );
};
