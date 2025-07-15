import { useFrame } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import { Color,ShaderMaterial, Vector2 } from 'three';

import waterFragmentShader from '../../assets/shaders/water/fragment.glsl?raw';
import waterVertexShader from '../../assets/shaders/water/vertex.glsl?raw';
import { useScroll } from '../../store/useScroll.ts';
import type { ITheme } from '../../store/useTheme.ts';
import { THEME_COLORS, useTheme } from '../../store/useTheme.ts';
import { useWindowSize } from '../../store/useWindowSize.ts';

export const HeroScene = () => {
  const {
    theme,
  } = useTheme((state: ITheme) => {
    return {
      theme: state.theme,
    };
  });

  const {
    scrollPercentage,
  } = useScroll((state) => {
    return {
      scrollPercentage: state.scrollPercentage,
    };
  });

  const {
    innerWidth,
  } = useWindowSize((state) => {
    return {
      innerWidth: state.innerWidth,
    };
  });

  const [{
    waveXPosition,
    waveYPosition,
    waveZPosition,
    waveXRotation,
    waveYRotation,
    waveZRotation,
  }] = useControls('Hero Scene', () => ({
    wave: folder({
      position: folder({
        waveXPosition: {
          value: 0.5,
          step: 0.02
        },
        waveYPosition: {
          value: -0.2,
          step: 0.02
        },
        waveZPosition: {
          value: 3.5,
          step: 0.02
        },
      }),
      rotation: folder({
        waveXRotation: {
          value: -Math.PI * 0.45,
          step: 0.02
        },
        waveYRotation: {
          value: 0,
          step: 0.02
        },
        waveZRotation: {
          value: Math.PI * 0.55,
          step: 0.02
        },
      }),
    }, { collapsed: true }),
  }));

  useFrame(({ clock }) => {
    waterMaterial.uniforms.uTime.value = clock.getElapsedTime();
  });

  const waterMaterial = new ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
      // Time
      uTime: { value: 0 },

      // Big Wave Elevation
      uBigWavesElevation: { value: 0.2 },
      uBigWavesFrequency: { value: new Vector2(1.0, 1.15) },
      uBigWavesSpeed: { value: 0.6 },

      // Small Wave Elevation
      uSmallWavesElevation: { value: 0.125 },
      uSmallWavesFrequency: { value: 2.0 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallWavesIterations: { value: 4.0 },

      // Color
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 4.8 },
      uDepthColor: { value: new Color(THEME_COLORS[theme].secondary) },
      uSurfaceColor: { value: new Color(...THEME_COLORS[theme].primary) },
    },
  });

  return (
    <>
      {
        scrollPercentage < 0.9 &&
        <mesh
          rotation={[waveXRotation + scrollPercentage * 4, waveYRotation, waveZRotation]}
          position={[waveXPosition, waveYPosition + scrollPercentage * 2, waveZPosition]}
        >
          <planeGeometry
            args={[5, 12, 512, 512]}
          />
          <primitive object={waterMaterial}/>
        </mesh>
      }

      {
        scrollPercentage < 0.5 && <mesh
          position={[0, scrollPercentage * 24, innerWidth < 768 ? -5.5 : -3]}
        >
          <sphereGeometry args={[4, 64, 64]}/>
          <meshBasicMaterial color={THEME_COLORS[theme].tertiary}/>
        </mesh>
      }
    </>
  );
};
