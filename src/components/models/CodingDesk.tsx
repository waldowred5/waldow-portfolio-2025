import { RoundedBox } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import type { Mesh, MeshPhysicalMaterial } from 'three';
import { Color } from 'three';

import { useWireframeProgress } from '@/hooks/useWireframeProgress.ts';
import {
  addBarycentricCoords,
  applyWireframeShader,
  createWireframeUniforms,
} from '@/lib/wireframeShader.ts';
import { THEME_COLORS, useTheme } from '@/store/useTheme.ts';

type Props = {
  position: [number, number, number];
  transmission: number;
  roughness: number;
  thickness: number;
  ior: number;
  clearcoat: number;
  attenuationDistance: number;
  color: string;
};

export const CodingDesk = ({
  position,
  transmission,
  roughness,
  thickness,
  ior,
  clearcoat,
  attenuationDistance,
  color,
}: Props) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const wireframeUniforms = useRef(createWireframeUniforms());
  const attenuationColorRef = useRef(
    new Color(THEME_COLORS[useTheme.getState().theme].secondary).multiplyScalar(
      0.2,
    ),
  );

  useEffect(() => {
    if (!meshRef.current || !materialRef.current) {
      return;
    }
    meshRef.current.geometry = addBarycentricCoords(meshRef.current.geometry);
    applyWireframeShader(materialRef.current, wireframeUniforms.current);
    materialRef.current.needsUpdate = true;
  }, []);

  useEffect(() => {
    return useTheme.subscribe((state) => {
      materialRef.current?.attenuationColor
        .set(THEME_COLORS[state.theme].secondary)
        .multiplyScalar(0.2);
    });
  }, []);

  useWireframeProgress(wireframeUniforms.current);

  return (
    <RoundedBox
      ref={meshRef}
      args={[8, 4, 0.1]}
      radius={0.1}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
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
        attenuationColor={attenuationColorRef.current}
        color={color}
      />
    </RoundedBox>
  );
};
