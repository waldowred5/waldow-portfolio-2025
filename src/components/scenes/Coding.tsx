import {
  type CameraControls as ThreeCameraControls,
  RoundedBox,
} from '@react-three/drei';
import {
  CameraControls,
  Environment,
  Html,
  PerspectiveCamera,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { button, buttonGroup, folder, useControls } from 'leva';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Color, type RectAreaLight } from 'three';

import { Macbook } from '@/components/models/Macbook.tsx';
import { WaldowAvatar } from '@/components/models/WaldowAvatar.tsx';
import { THEME_TRANSITION_DURATION } from '@/lib/constants.ts';
import { type ITheme, THEME_COLORS, useTheme } from '@/store/useTheme.ts';

export const Coding = () => {
  const { theme } = useTheme((state: ITheme) => ({ theme: state.theme }));
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [occlusionMode, setOcclusionMode] = useState<boolean | 'blending'>(
    false,
  );
  const cameraControls = useRef<ThreeCameraControls>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rectLightRef = useRef<RectAreaLight>(null);
  const currentLerpedColor = useRef(new Color(THEME_COLORS[theme].secondary));
  const lerpState = useRef({
    fromColor: new Color(THEME_COLORS[theme].secondary),
    toColor: new Color(THEME_COLORS[theme].secondary),
    elapsed: THEME_TRANSITION_DURATION,
  });
  const { camera } = useThree();

  const defaultMacbookValues = {
    scenePosition: { x: 0, y: -0.8, z: 1 },
    sceneRotation: { x: 0.34, y: 0.42, z: 0 },
  };

  const defaultPortalValues = {
    portalSizeFactor: 1.35,
    portalPosition: { x: 0, y: 1.69, z: -1.69 },
    portalRotation: { x: -0.35, y: 0, z: 0 },
  };

  const defaultDeskValues = {
    deskPosition: { x: 0.8, y: 0.4, z: -0.7 },
    chairPosition: { x: 0.76, y: -3.09, z: 4.5 },
  };

  const defaultCameraValues = {
    enableCameraControls: true,
    cameraPosition: {
      x: -1.5,
      y: 3.5,
      z: 16,
    },
  };

  useEffect(() => {
    if (iframeLoaded) {
      setOcclusionMode('blending');
    } else {
      setOcclusionMode(false);
    }
  }, [iframeLoaded]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'THEME_CHANGE', theme }, '*');
  }, [theme]);

  useEffect(() => {
    lerpState.current.fromColor.copy(currentLerpedColor.current);
    lerpState.current.toColor.set(THEME_COLORS[theme].secondary);
    lerpState.current.elapsed = 0;
  }, [theme]);

  useFrame((_, delta) => {
    const light = rectLightRef.current;
    const state = lerpState.current;
    if (!light) return;

    if (state.elapsed < THEME_TRANSITION_DURATION) {
      state.elapsed = Math.min(state.elapsed + delta, THEME_TRANSITION_DURATION);
      const t = state.elapsed / THEME_TRANSITION_DURATION;
      currentLerpedColor.current.copy(state.fromColor).lerp(state.toColor, t);
    }

    light.color.copy(currentLerpedColor.current);
  });

  useEffect(() => {
    const controls = cameraControls.current;
    if (!controls) return;
    controls.setLookAt(0, 0, 5, 0, 0, 0, false);
    controls.setLookAt(
      defaultCameraValues.cameraPosition.x,
      defaultCameraValues.cameraPosition.y,
      defaultCameraValues.cameraPosition.z,
      0, 0, 0,
      true,
    );
  }, []);

  const [
    {
      enableCameraControls,
      scenePosition,
      sceneRotation,
      deskPosition,
      chairPosition,
      portalSizeFactor,
      portalPosition,
      portalRotation,
    },
    set,
  ] = useControls(
    'Coding Scene',
    () => ({
      camera: folder({
        'Reset Camera Defaults': button(() => set(defaultCameraValues)),
        enableCameraControls: {
          value: defaultCameraValues.enableCameraControls,
          label: 'Enable Camera Controls',
        },
        logCamera: button(() => {
          console.log('Camera pos:', camera.position);
          console.log('Camera Controls:', cameraControls.current);
        }),
        truckGrp: buttonGroup({
          label: 'truck',
          opts: {
            '(1,0)': () => cameraControls.current?.truck(1, 0, true),
            '(-1,0)': () => cameraControls.current?.truck(-1, 0, true),
            '(0,1)': () => cameraControls.current?.truck(0, 1, true),
            '(0,-1)': () => cameraControls.current?.truck(0, -1, true),
          },
        }),
        dollyGrp: buttonGroup({
          label: 'dolly',
          opts: {
            '1': () => cameraControls.current?.dolly(1, true),
            '-1': () => cameraControls.current?.dolly(-1, true),
          },
        }),
        zoomGrp: buttonGroup({
          label: 'zoom',
          opts: {
            '/2': () => cameraControls.current?.zoom(camera.zoom / 2, true),
            '/-2': () => cameraControls.current?.zoom(-camera.zoom / 2, true),
          },
        }),
      }),
      scene: folder(
        {
          'Reset Macbook Defaults': button(() => set(defaultMacbookValues)),
          scenePosition: {
            x: defaultMacbookValues.scenePosition.x,
            y: defaultMacbookValues.scenePosition.y,
            z: defaultMacbookValues.scenePosition.z,
          },
          sceneRotation: {
            x: defaultMacbookValues.sceneRotation.x,
            y: defaultMacbookValues.sceneRotation.y,
            z: defaultMacbookValues.sceneRotation.z,
          },
        },
        { collapsed: true },
      ),
      desk: folder({
        'Reset Desk Defaults': button(() => set(defaultDeskValues)),
        deskPosition: {
          x: defaultDeskValues.deskPosition.x,
          y: defaultDeskValues.deskPosition.y,
          z: defaultDeskValues.deskPosition.z,
        },
        chairPosition: {
          x: defaultDeskValues.chairPosition.x,
          y: defaultDeskValues.chairPosition.y,
          z: defaultDeskValues.chairPosition.z,
        },
      }),
      portal: folder(
        {
          'Reset Portal Defaults': button(() => set(defaultPortalValues)),
          portalSizeFactor: {
            value: defaultPortalValues.portalSizeFactor,
            min: 0.5,
            max: 3,
            step: 0.01,
          },
          portalPosition: {
            x: defaultPortalValues.portalPosition.x,
            y: defaultPortalValues.portalPosition.y,
            z: defaultPortalValues.portalPosition.z,
          },
          portalRotation: {
            x: defaultPortalValues.portalRotation.x,
            y: defaultPortalValues.portalRotation.y,
            z: defaultPortalValues.portalRotation.z,
          },
        },
        { collapsed: true },
      ),
    }),
    { collapsed: true },
  );

  useControls('Coding Scene', {
    'Transmissive Mesh': folder({
      meshPhysicalMaterial: false,
      transmissionSampler: false,
      backside: false,
      samples: { value: 10, min: 1, max: 32, step: 1 },
      resolution: { value: 2048, min: 256, max: 2048, step: 256 },
      transmission: { value: 1, min: 0, max: 1 },
      roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
      thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
      ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
      chromaticAberration: { value: 0.06, min: 0, max: 1 },
      anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
      distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
      distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
      temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
      clearcoat: { value: 1, min: 0, max: 1 },
      attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
      attenuationColor: '#ffffff',
      color: '#c9ffa1',
      bg: '#839681',
    }),
  });

  return (
    <Suspense>
      <PerspectiveCamera
        makeDefault
        position={[
          defaultCameraValues.cameraPosition.x,
          defaultCameraValues.cameraPosition.y,
          defaultCameraValues.cameraPosition.z,
        ]}
      />
      <CameraControls
        makeDefault
        enabled={enableCameraControls}
        ref={cameraControls}
        smoothTime={0.6}
      />

      <group
        position={[scenePosition.x, scenePosition.y, scenePosition.z]}
        rotation={[sceneRotation.x, sceneRotation.y, sceneRotation.z]}
      >
        <Environment preset={'city'} />
        <ambientLight intensity={0.5} />
        <rectAreaLight
          ref={rectLightRef}
          width={2.5}
          height={1.65}
          intensity={165}
          rotation={[-0.1, Math.PI, 0]}
          position={[0, 0.55, -1.15]}
        />

        <WaldowAvatar />

        {/* Desk */}
        <RoundedBox
          args={[8, 4, 0.1]}
          radius={0.1}
          position={[deskPosition.x, deskPosition.y, deskPosition.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshPhongMaterial transparent opacity={0.25} />
          {/*<MeshTransmissionMaterial {...config} />*/}
        </RoundedBox>

        {/* Chair */}
        <RoundedBox
          args={[3.5, 3.5, 3.5]}
          radius={0.5}
          position={[chairPosition.x, chairPosition.y, chairPosition.z]}
        >
          <meshPhongMaterial transparent opacity={0.25} />
          {/*<MeshTransmissionMaterial {...config} />*/}
        </RoundedBox>

        <Macbook>
          <Html
            transform
            occlude={occlusionMode}
            wrapperClass={'htmlScreen'}
            distanceFactor={portalSizeFactor}
            position={[portalPosition.x, portalPosition.y, portalPosition.z]}
            rotation={[portalRotation.x, portalRotation.y, portalRotation.z]}
          >
            <iframe
              ref={iframeRef}
              src={'/portal'}
              className={'w-[1024px] h-[670px] rounded-[20px] border-none'}
              onLoad={() => setIframeLoaded(true)}
            />
          </Html>
        </Macbook>
      </group>
    </Suspense>
  );
};
