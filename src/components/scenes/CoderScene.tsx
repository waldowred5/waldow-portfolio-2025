// import { useFrame } from '@react-three/fiber';
// import { THEME_COLORS, useTheme } from '../store/useTheme.ts';

import { Color } from 'three';

export const CoderScene = () => {
  // const {
  //   theme,
  // } = useTheme((state) => {
  //   return {
  //     theme: state.theme,
  //   };
  // });

  // useFrame(({ clock }) => {
  //   waterMaterial.uniforms.uTime.value = clock.getElapsedTime();
  // });

  return (
    <>
      <group>
        <mesh
          position={[0, -10, -5]}
        >
          <sphereGeometry args={[1, 32, 32]}/>
          <meshBasicMaterial color={ new Color('yellow') }/>
        </mesh>
      </group>
    </>
  );
};
