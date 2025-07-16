import { useFrame } from '@react-three/fiber';
import { button, folder, useControls } from 'leva';
import { Color, ShaderMaterial, Vector2 } from 'three';

import { TABLET_BREAKPOINT } from '@/lib/constants.ts';
import { useMousePosition } from '@/store/useMousePosition.ts';
import type { ITheme } from '@/store/useTheme.ts';
import { THEME_COLORS, useTheme } from '@/store/useTheme.ts';
import { useWindowSize } from '@/store/useWindowSize.ts';

import waterFragmentShader from '../../assets/shaders/water/fragment.glsl?raw';
import waterVertexShader from '../../assets/shaders/water/vertex.glsl?raw';

export const HeroScene = () => {
  const { theme } = useTheme((state: ITheme) => {
    return {
      theme: state.theme,
    };
  });

  const { innerWidth } = useWindowSize((state) => {
    return {
      innerWidth: state.innerWidth,
    };
  });

  const mousePosition = useMousePosition();

  const defaultSunValues = {
    radius: 4,
    sunXPosition: 0,
    sunXPositionMouseXFactor: 1400,
    sunYPosition: 0,
    sunYPositionMouseYFactor: 3600,
    sunZPosition: innerWidth < TABLET_BREAKPOINT ? -5.5 : -3,
  };

  const defaultWaveValues = {
    waveXPosition: 0.5,
    waveYPosition: -0.5,
    waveZPosition: 3.5,
    waveXRotation: -Math.PI * 0.4,
    waveXRotationMouseYFactor: 3750,
    waveYRotation: 0,
    waveYRotationMouseXFactor: 15000,
    waveZRotation: Math.PI * 0.55,
  };

  const [
    {
      radius,
      sunXPosition,
      sunXPositionMouseXFactor,
      sunYPosition,
      sunYPositionMouseYFactor,
      sunZPosition,
      waveXPosition,
      waveYPosition,
      waveZPosition,
      waveXRotation,
      waveXRotationMouseYFactor,
      waveYRotation,
      waveYRotationMouseXFactor,
      waveZRotation,
    },
    set,
  ] = useControls('Hero Scene', () => ({
    sun: folder({
      'Reset Sun Defaults': button(() => set(defaultSunValues)),
      radius: {
        value: defaultSunValues.radius,
        step: 0.1,
      },
      position: folder({
        sunXPosition: {
          value: defaultSunValues.sunXPosition,
          step: 0.02,
        },
        sunXPositionMouseXFactor: {
          value: defaultSunValues.sunXPositionMouseXFactor,
          step: 50,
          min: 500,
          max: 15000,
        },
        sunYPosition: {
          value: defaultSunValues.sunYPosition,
          step: 0.02,
        },
        sunYPositionMouseYFactor: {
          value: defaultSunValues.sunYPositionMouseYFactor,
          step: 50,
          min: 500,
          max: 15000,
        },
        sunZPosition: {
          value: defaultSunValues.sunZPosition,
          step: 0.02,
        },
      }),
    }),
    wave: folder(
      {
        'Reset Wave Defaults': button(() => set(defaultWaveValues)),
        position: folder({
          waveXPosition: {
            value: defaultWaveValues.waveXPosition,
            step: 0.02,
          },
          waveYPosition: {
            value: defaultWaveValues.waveYPosition,
            step: 0.02,
          },
          waveZPosition: {
            value: defaultWaveValues.waveZPosition,
            step: 0.02,
          },
        }),
        rotation: folder({
          waveXRotation: {
            value: defaultWaveValues.waveXRotation,
            step: 0.02,
          },
          waveXRotationMouseYFactor: {
            value: defaultWaveValues.waveXRotationMouseYFactor,
            step: 50,
            min: 1500,
            max: 35000,
          },
          waveYRotation: {
            value: defaultWaveValues.waveYRotation,
            step: 0.02,
          },
          waveYRotationMouseXFactor: {
            value: defaultWaveValues.waveYRotationMouseXFactor,
            step: 50,
            min: 0,
            max: 15000000,
          },
          waveZRotation: {
            value: defaultWaveValues.waveZRotation,
            step: 0.02,
          },
        }),
      },
      { collapsed: false },
    ),
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
      {/* Sun */}
      <mesh
        position={[
          sunXPosition + mousePosition.x / -sunXPositionMouseXFactor,
          sunYPosition + mousePosition.y / sunYPositionMouseYFactor,
          sunZPosition,
        ]}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color={THEME_COLORS[theme].tertiary} />
      </mesh>

      {/* Wave */}
      <mesh
        rotation={[
          waveXRotation + mousePosition.y / waveXRotationMouseYFactor,
          waveYRotation - mousePosition.x / -waveYRotationMouseXFactor,
          waveZRotation,
        ]}
        position={[waveXPosition, waveYPosition, waveZPosition]}
      >
        <planeGeometry args={[5, 12, 512, 512]} />
        <primitive object={waterMaterial} />
      </mesh>
    </>
  );
};
