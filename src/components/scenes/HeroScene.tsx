import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { button, folder, useControls } from 'leva';
import { Color, ShaderMaterial, Vector2 } from 'three';

import { HeroText } from '@/components/ui/HeroText.tsx';
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
    sunPosition: { x: 0, y: 0, z: innerWidth < TABLET_BREAKPOINT ? -5.5 : -3 },
    sunXPositionMouseXFactor: 1400,
    sunYPositionMouseYFactor: 3600,
  };

  const defaultWaveValues = {
    wavePosition: { x: 0.5, y: -0.5, z: 3.5 },
    waveRotation: { x: -Math.PI * 0.4, y: 0, z: Math.PI * 0.55 },
    waveXRotationMouseYFactor: 3750,
    waveYRotationMouseXFactor: 15000,
  };

  const defaultHTMLValues = {
    position: { x: 0, y: 0, z: 0.5 },
    center: true,
    transform: true,
    occlude: 'blending',
  };

  const [
    {
      radius,
      sunPosition,
      sunXPositionMouseXFactor,
      sunYPositionMouseYFactor,
      wavePosition,
      waveRotation,
      waveXRotationMouseYFactor,
      waveYRotationMouseXFactor,
      htmlPosition,
    },
    set,
  ] = useControls(
    'Hero Scene',
    () => ({
      sun: folder(
        {
          'Reset Sun Defaults': button(() => set(defaultSunValues)),
          radius: {
            value: defaultSunValues.radius,
            step: 0.1,
          },
          sunPosition: {
            x: defaultSunValues.sunPosition.x,
            y: defaultSunValues.sunPosition.y,
            z: defaultSunValues.sunPosition.z,
          },
          sunXPositionMouseXFactor: {
            value: defaultSunValues.sunXPositionMouseXFactor,
            step: 50,
            min: 500,
            max: 15000,
          },
          sunYPositionMouseYFactor: {
            value: defaultSunValues.sunYPositionMouseYFactor,
            step: 50,
            min: 500,
            max: 15000,
          },
        },
        { collapsed: false },
      ),
      wave: folder(
        {
          'Reset Wave Defaults': button(() => set(defaultWaveValues)),
          wavePosition: {
            x: defaultWaveValues.wavePosition.x,
            y: defaultWaveValues.wavePosition.y,
            z: defaultWaveValues.wavePosition.z,
          },
          waveRotation: {
            x: defaultWaveValues.waveRotation.x,
            y: defaultWaveValues.waveRotation.y,
            z: defaultWaveValues.waveRotation.z,
          },
          waveXRotationMouseYFactor: {
            value: defaultWaveValues.waveXRotationMouseYFactor,
            step: 50,
            min: 1500,
            max: 35000,
          },
          waveYRotationMouseXFactor: {
            value: defaultWaveValues.waveYRotationMouseXFactor,
            step: 50,
            min: 0,
            max: 15000000,
          },
        },
        { collapsed: true },
      ),
      html: folder({
        'Reset HTML Defaults': button(() => set(defaultHTMLValues)),
        htmlPosition: {
          x: defaultHTMLValues.position.x,
          y: defaultHTMLValues.position.y,
          z: defaultHTMLValues.position.z,
        },
        center: {
          value: defaultHTMLValues.center,
        },
        transform: {
          value: defaultHTMLValues.transform,
        },
        occlude: {
          value: defaultHTMLValues.occlude,
        },
      }),
    }),
    { collapsed: false },
  );

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
          sunPosition.x + mousePosition.x / -sunXPositionMouseXFactor,
          sunPosition.y + mousePosition.y / sunYPositionMouseYFactor,
          sunPosition.z,
        ]}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color={THEME_COLORS[theme].tertiary} />
      </mesh>

      {/* Wave */}
      <mesh
        position={[wavePosition.x, wavePosition.y, wavePosition.z]}
        rotation={[
          waveRotation.x + mousePosition.y / waveXRotationMouseYFactor,
          waveRotation.y - mousePosition.x / -waveYRotationMouseXFactor,
          waveRotation.z,
        ]}
      >
        <planeGeometry args={[5, 12, 512, 512]} />
        <primitive object={waterMaterial} />
      </mesh>

      {/* Title */}
      <Html
        center
        position={[
          sunPosition.x + (mousePosition.x / -sunXPositionMouseXFactor) * 0.1,
          sunPosition.y + mousePosition.y / sunYPositionMouseYFactor,
          htmlPosition.z,
        ]}
      >
        <HeroText />
      </Html>
    </>
  );
};
