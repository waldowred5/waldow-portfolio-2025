import {
  CameraControls,
  type CameraControls as ThreeCameraControls,
  Environment,
  Html,
  Line,
  PerspectiveCamera,
  RoundedBox,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { button, buttonGroup, folder, useControls } from 'leva';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import { Color, Quaternion, type RectAreaLight, Vector3 } from 'three';

import { Macbook } from '@/components/models/Macbook.tsx';
import { WaldowAvatar } from '@/components/models/WaldowAvatar.tsx';
import {
  TABLET_BREAKPOINT,
  THEME_TRANSITION_DURATION,
} from '@/lib/constants.ts';
import { useAboutMePanel } from '@/store/useAboutMePanel.ts';
import { useCodingSceneReady } from '@/store/useCodingSceneReady.ts';
import { useScene } from '@/store/useScene.ts';
import { type ITheme, THEME_COLORS, useTheme } from '@/store/useTheme.ts';

interface Props {
  isActive?: boolean;
}

export const Coding = ({ isActive = true }: Props) => {
  const { theme } = useTheme((state: ITheme) => ({ theme: state.theme }));
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const cameraControls = useRef<ThreeCameraControls>(null);
  const portalRef = useRef<Group>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rectLightRef = useRef<RectAreaLight>(null);
  const currentLerpedColor = useRef(new Color(THEME_COLORS[theme].secondary));
  const lerpState = useRef({
    fromColor: new Color(THEME_COLORS[theme].secondary),
    toColor: new Color(THEME_COLORS[theme].secondary),
    elapsed: THEME_TRANSITION_DURATION,
  });
  const { camera } = useThree();
  const setPortalReady = useCodingSceneReady((s) => s.setPortalReady);
  const { showPanel, hidePanel } = useAboutMePanel((s) => ({
    showPanel: s.showPanel,
    hidePanel: s.hidePanel,
  }));
  const { pendingScene, commitScene } = useScene((s) => ({
    pendingScene: s.pendingScene,
    commitScene: s.commitScene,
  }));
  const hasShownPanel = useRef(false);
  const prevIsActiveRef = useRef(false);

  const defaultMacbookValues = {
    scenePosition: { x: 0, y: -0.8, z: 1 },
    sceneRotation: { x: 0.34, y: 0.42, z: 0 },
    environmentIntensity: 0.5,
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
    shoulderPosition: { x: 0, y: 2, z: 17.5 },
    desktopShoulderPosition: { x: 8, y: 2, z: 17.5 },
  };

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'THEME_CHANGE', theme },
      '*',
    );
  }, [theme]);

  useEffect(() => {
    lerpState.current.fromColor.copy(currentLerpedColor.current);
    lerpState.current.toColor.set(THEME_COLORS[theme].secondary);
    lerpState.current.elapsed = 0;
  }, [theme]);

  useFrame((_, delta) => {
    const light = rectLightRef.current;
    const state = lerpState.current;
    if (!light) {
      return;
    }

    if (state.elapsed < THEME_TRANSITION_DURATION) {
      state.elapsed = Math.min(
        state.elapsed + delta,
        THEME_TRANSITION_DURATION,
      );
      const t = state.elapsed / THEME_TRANSITION_DURATION;
      currentLerpedColor.current.copy(state.fromColor).lerp(state.toColor, t);
    }

    light.color.copy(currentLerpedColor.current);
  });

  const [
    {
      enableCameraControls,
      shoulderPosition,
      desktopShoulderPosition,
      scenePosition,
      sceneRotation,
      environmentIntensity,
      deskPosition,
      chairPosition,
      portalSizeFactor,
      portalPosition,
      portalRotation,
      showPortalNormal,
      showPortalHorizontal,
      cameraDistance,
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
        shoulderPosition: {
          value: defaultCameraValues.shoulderPosition,
          label: 'Shoulder Position',
        },
        desktopShoulderPosition: {
          value: defaultCameraValues.desktopShoulderPosition,
          label: 'Desktop Shoulder Position',
        },
        logCamera: button(() => {
          const pos = camera.position;
          console.log(
            `Camera pos: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}, z=${pos.z.toFixed(2)}`,
          );
          if (cameraControls.current) {
            const target = cameraControls.current.getTarget({
              x: 0,
              y: 0,
              z: 0,
            } as Vector3);
            console.log(
              `Camera target: x=${target.x.toFixed(2)}, y=${target.y.toFixed(2)}, z=${target.z.toFixed(2)}`,
            );
          }
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
          scenePosition: { value: defaultMacbookValues.scenePosition },
          sceneRotation: { value: defaultMacbookValues.sceneRotation },
          environmentIntensity: {
            value: defaultMacbookValues.environmentIntensity,
            min: 0,
            max: 0.03,
            step: 0.01,
            label: 'Environment Intensity',
          },
        },
        { collapsed: true },
      ),
      desk: folder(
        {
          'Reset Desk Defaults': button(() => set(defaultDeskValues)),
          deskPosition: { value: defaultDeskValues.deskPosition },
          chairPosition: { value: defaultDeskValues.chairPosition },
        },
        { collapsed: true },
      ),
      portal: folder(
        {
          'Reset Portal Defaults': button(() => set(defaultPortalValues)),
          portalSizeFactor: {
            value: defaultPortalValues.portalSizeFactor,
            min: 0.5,
            max: 3,
            step: 0.01,
          },
          portalPosition: { value: defaultPortalValues.portalPosition },
          portalRotation: { value: defaultPortalValues.portalRotation },
          logPortalWorldPos: button(() => {
            if (!portalRef.current) {
              return;
            }
            const pos = portalRef.current.getWorldPosition(new Vector3());
            console.log(
              `Portal world pos: x=${pos.x.toFixed(3)}, y=${pos.y.toFixed(3)}, z=${pos.z.toFixed(3)}`,
            );
          }),
          showPortalNormal: { value: false, label: 'Show Portal Axis' },
          showPortalHorizontal: { value: false, label: 'Show Horizontal Axis' },
          cameraDistance: {
            value: 2,
            min: 0,
            max: 20,
            step: 0.05,
            label: 'Camera Distance',
          },
        },
        { collapsed: true },
      ),
    }),
    { collapsed: true },
  );

  useFrame(() => {
    const becameActive = isActive && !prevIsActiveRef.current;
    prevIsActiveRef.current = isActive;
    if (!becameActive || !cameraControls.current || !portalRef.current) {
      return;
    }
    const activeShoulderPosition =
      window.innerWidth >= TABLET_BREAKPOINT
        ? desktopShoulderPosition
        : shoulderPosition;
    portalRef.current.updateWorldMatrix(true, false);
    const worldPos = portalRef.current.getWorldPosition(new Vector3());
    const worldQuat = portalRef.current.getWorldQuaternion(new Quaternion());
    const normal = new Vector3(0, 0, 1).applyQuaternion(worldQuat);
    const camPos = worldPos.clone().addScaledVector(normal, cameraDistance);
    cameraControls.current.camera.up
      .set(0, 1, 0)
      .applyQuaternion(worldQuat)
      .normalize();
    cameraControls.current.setLookAt(
      camPos.x,
      camPos.y,
      camPos.z,
      worldPos.x,
      worldPos.y,
      worldPos.z,
      false,
    );
    cameraControls.current.camera.up.set(0, 1, 0);
    cameraControls.current.setLookAt(
      activeShoulderPosition.x,
      activeShoulderPosition.y,
      activeShoulderPosition.z,
      worldPos.x,
      worldPos.y,
      worldPos.z,
      true,
    );
  });

  useEffect(() => {
    if (!portalRef.current || !cameraControls.current) {
      return;
    }
    portalRef.current.updateWorldMatrix(true, false);
    const worldPos = portalRef.current.getWorldPosition(new Vector3());
    const worldQuat = portalRef.current.getWorldQuaternion(new Quaternion());
    const normal = new Vector3(0, 0, 1).applyQuaternion(worldQuat);
    const camPos = worldPos.clone().addScaledVector(normal, cameraDistance);
    cameraControls.current.camera.up
      .set(0, 1, 0)
      .applyQuaternion(worldQuat)
      .normalize();
    cameraControls.current.setLookAt(
      camPos.x,
      camPos.y,
      camPos.z,
      worldPos.x,
      worldPos.y,
      worldPos.z,
      true,
    );
  }, [cameraDistance]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    hasShownPanel.current = false;
    hidePanel();
    const timer = setTimeout(() => showPanel(), 2500);

    return () => clearTimeout(timer);
  }, [isActive, hidePanel, showPanel]);

  useEffect(() => {
    if (
      !pendingScene ||
      !isActive ||
      !cameraControls.current ||
      !portalRef.current
    ) {
      return;
    }

    hidePanel();
    hasShownPanel.current = false;

    portalRef.current.updateWorldMatrix(true, false);
    const worldPos = portalRef.current.getWorldPosition(new Vector3());
    const worldQuat = portalRef.current.getWorldQuaternion(new Quaternion());
    const normal = new Vector3(0, 0, 1).applyQuaternion(worldQuat);
    const camPos = worldPos.clone().addScaledVector(normal, cameraDistance);

    cameraControls.current.camera.up
      .set(0, 1, 0)
      .applyQuaternion(worldQuat)
      .normalize();
    cameraControls.current.setLookAt(
      camPos.x,
      camPos.y,
      camPos.z,
      worldPos.x,
      worldPos.y,
      worldPos.z,
      true,
    );
    cameraControls.current.camera.up.set(0, 1, 0);

    const exitTimer = setTimeout(() => commitScene(), 2000);

    return () => clearTimeout(exitTimer);
  }, [pendingScene, isActive, commitScene, hidePanel, cameraDistance]);

  const {
    transmission: meshTransmission,
    roughness: meshRoughness,
    thickness: meshThickness,
    ior: meshIor,
    clearcoat: meshClearcoat,
    attenuationDistance: meshAttenuationDistance,
    attenuationColor: meshAttenuationColor,
    color: meshColor,
  } = useControls('Coding Scene', {
    'Transmissive Mesh': folder(
      {
        options: folder({
          meshPhysicalMaterial: false,
          transmissionSampler: false,
          backside: false,
          samples: { value: 10, min: 1, max: 32, step: 1 },
          resolution: { value: 2048, min: 256, max: 2048, step: 256 },
        }),
        surface: folder({
          transmission: { value: 1, min: 0, max: 1 },
          roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
          thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
          ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
          clearcoat: { value: 1, min: 0, max: 1 },
        }),
        distortion: folder({
          chromaticAberration: { value: 0.06, min: 0, max: 1 },
          anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
          distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
          distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
          temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
        }),
        color: folder({
          attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
          attenuationColor: '#ffffff',
          color: '#c9ffa1',
          bg: '#839681',
        }),
      },
      { collapsed: true },
    ),
  });

  return (
    <Suspense>
      <PerspectiveCamera makeDefault={isActive} />
      <CameraControls
        makeDefault={isActive}
        enabled={isActive && enableCameraControls}
        ref={cameraControls}
        smoothTime={1.5}
      />

      <group
        position={[scenePosition.x, scenePosition.y, scenePosition.z]}
        rotation={[sceneRotation.x, sceneRotation.y, sceneRotation.z]}
      >
        <Environment
          preset={'city'}
          environmentIntensity={environmentIntensity}
        />
        <ambientLight intensity={isActive ? 0.2 : 0} />
        <rectAreaLight
          ref={rectLightRef}
          width={2.5}
          height={1.65}
          intensity={isActive ? 165 : 0}
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
          <meshPhysicalMaterial
            transparent
            transmission={meshTransmission}
            roughness={meshRoughness}
            thickness={meshThickness}
            ior={meshIor}
            clearcoat={meshClearcoat}
            attenuationDistance={meshAttenuationDistance}
            attenuationColor={meshAttenuationColor}
            color={meshColor}
          />
        </RoundedBox>

        {/* Chair */}
        <RoundedBox
          args={[3.5, 3.5, 3.5]}
          radius={0.5}
          position={[chairPosition.x, chairPosition.y, chairPosition.z]}
        >
          <meshPhysicalMaterial
            transparent
            transmission={meshTransmission}
            roughness={meshRoughness}
            thickness={meshThickness}
            ior={meshIor}
            clearcoat={meshClearcoat}
            attenuationDistance={meshAttenuationDistance}
            attenuationColor={meshAttenuationColor}
            color={meshColor}
          />
        </RoundedBox>

        <Macbook>
          <group
            ref={portalRef}
            position={[portalPosition.x, portalPosition.y, portalPosition.z]}
            rotation={[portalRotation.x, portalRotation.y, portalRotation.z]}
          >
            {showPortalNormal && (
              <Line
                points={[
                  [0, 0, -10],
                  [0, 0, 10],
                ]}
                color={'yellow'}
                lineWidth={1}
              />
            )}
            {showPortalHorizontal && (
              <Line
                points={[
                  [-10, 0, 0],
                  [10, 0, 0],
                ]}
                color={'cyan'}
                lineWidth={1}
              />
            )}
          </group>
          <Html
            transform
            occlude={iframeLoaded && isActive ? 'blending' : false}
            wrapperClass={'htmlScreen'}
            distanceFactor={portalSizeFactor}
            position={[portalPosition.x, portalPosition.y, portalPosition.z]}
            rotation={[portalRotation.x, portalRotation.y, portalRotation.z]}
          >
            <iframe
              ref={iframeRef}
              src={'/portal'}
              className={`w-[1024px] h-[670px] rounded-[20px] border-none${isActive ? '' : ' opacity-0 pointer-events-none'}`}
              onLoad={() => {
                setIframeLoaded(true);
                setPortalReady();
              }}
            />
          </Html>
        </Macbook>
      </group>
    </Suspense>
  );
};
