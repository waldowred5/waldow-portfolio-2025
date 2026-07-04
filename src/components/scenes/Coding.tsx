import {
  CameraControls,
  type CameraControls as ThreeCameraControls,
  Environment,
  Html,
  Line,
  PerspectiveCamera,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { button, buttonGroup, folder, useControls } from 'leva';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { Group, Mesh } from 'three';
import { Color, Quaternion, type RectAreaLight, Vector3 } from 'three';

import { CodingChair } from '@/components/models/CodingChair.tsx';
import { CodingDesk } from '@/components/models/CodingDesk.tsx';
import { Macbook } from '@/components/models/Macbook.tsx';
import { WaldowAvatar } from '@/components/models/WaldowAvatar.tsx';
import {
  TABLET_BREAKPOINT,
  THEME_TRANSITION_DURATION,
} from '@/lib/constants.ts';
import { useAboutMePanel } from '@/store/useAboutMePanel.ts';
import { useCodingSceneReady } from '@/store/useCodingSceneReady.ts';
import { usePerformanceTier } from '@/store/usePerformanceTier.ts';
import { useScene } from '@/store/useScene.ts';
import { THEME_COLORS, useTheme } from '@/store/useTheme.ts';
import { useViewMode } from '@/store/useViewMode.ts';

interface Props {
  isActive?: boolean;
}

const getPortalWorldAxes = (portalRef: React.RefObject<Group | null>) => {
  if (!portalRef.current) return null;
  portalRef.current.updateWorldMatrix(true, false);
  const worldPos = portalRef.current.getWorldPosition(new Vector3());
  const worldQuat = portalRef.current.getWorldQuaternion(new Quaternion());
  const normal = new Vector3(0, 0, 1).applyQuaternion(worldQuat);

  return { worldPos, worldQuat, normal };
};

export const Coding = ({ isActive = true }: Props) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const cameraControls = useRef<ThreeCameraControls>(null);
  const portalRef = useRef<Group>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rectLightRef = useRef<RectAreaLight>(null);
  const entryMarkerRef = useRef<Mesh>(null);
  const exitMarkerRef = useRef<Mesh>(null);
  const entryDistanceRef = useRef(0.5);
  const exitDistanceRef = useRef(0.2);
  const initialTheme = useTheme.getState().theme;
  const currentLerpedColor = useRef(
    new Color(THEME_COLORS[initialTheme].secondary),
  );
  const lerpState = useRef({
    fromColor: new Color(THEME_COLORS[initialTheme].secondary),
    toColor: new Color(THEME_COLORS[initialTheme].secondary),
    elapsed: THEME_TRANSITION_DURATION,
  });
  const { camera } = useThree();
  const setPortalReady = useCodingSceneReady((s) => s.setPortalReady);
  const isLowPerf = usePerformanceTier((s) => s.isLowPerf);
  const { showPanel, hidePanel } = useAboutMePanel((s) => ({
    showPanel: s.showPanel,
    hidePanel: s.hidePanel,
  }));
  const { pendingScene, commitScene } = useScene((s) => ({
    pendingScene: s.pendingScene,
    commitScene: s.commitScene,
  }));
  const viewMode = useViewMode((s) => s.viewMode);
  const hasShownPanel = useRef(false);
  const prevIsActiveRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const positionCameraRef = useRef<() => void>(() => {});

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
    enableCameraControls: false,
    shoulderPosition: { x: -2, y: 2, z: 15 },
    desktopShoulderPosition: { x: -2, y: 2, z: 15 },
    lookAtOffset: { x: 2, y: -3, z: 0 },
    desktopLookAtOffset: { x: window.innerWidth * 0.006, y: -3, z: 0 },
    entryDistance: 2.3,
    exitDistance: 0.2,
    showCameraHelpers: false,
  };

  useEffect(() => {
    return useTheme.subscribe((state) => {
      // Deferred so the iframe's JS work doesn't compete with the React theme update
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'THEME_CHANGE', theme: state.theme },
          '*',
        );
      }, 100);
      lerpState.current.fromColor.copy(currentLerpedColor.current);
      lerpState.current.toColor.set(THEME_COLORS[state.theme].secondary);
      lerpState.current.elapsed = 0;
    });
  }, []);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'VIEW_MODE_CHANGE', viewMode },
      '*',
    );
  }, [viewMode]);

  const [
    {
      enableCameraControls,
      shoulderPosition,
      desktopShoulderPosition,
      lookAtOffset,
      desktopLookAtOffset,
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
      entryDistance,
      exitDistance,
      showCameraHelpers,
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
        lookAtOffset: {
          value: defaultCameraValues.lookAtOffset,
          label: 'LookAt Offset',
        },
        desktopLookAtOffset: {
          value: defaultCameraValues.desktopLookAtOffset,
          label: 'Desktop LookAt Offset',
        },
        entryDistance: {
          value: defaultCameraValues.entryDistance,
          min: 0,
          max: 10,
          step: 0.05,
          label: 'Entry Distance',
        },
        exitDistance: {
          value: defaultCameraValues.exitDistance,
          min: 0,
          max: 5,
          step: 0.01,
          label: 'Exit Distance',
        },
        showCameraHelpers: {
          value: defaultCameraValues.showCameraHelpers,
          label: 'Show Camera Markers',
        },
        logCamera: button(() => {
          const cam = cameraControls.current?.camera;
          if (!cam) return;
          const pos = cam.position;
          const worldPos2 = new Vector3();
          cam.getWorldPosition(worldPos2);
          const up = cam.up;
          const euler = cam.rotation;
          console.log(
            `Camera local pos: x=${pos.x.toFixed(3)}, y=${pos.y.toFixed(3)}, z=${pos.z.toFixed(3)}`,
          );
          console.log(
            `Camera world pos: x=${worldPos2.x.toFixed(3)}, y=${worldPos2.y.toFixed(3)}, z=${worldPos2.z.toFixed(3)}`,
          );
          console.log(
            `Camera up: x=${up.x.toFixed(3)}, y=${up.y.toFixed(3)}, z=${up.z.toFixed(3)}`,
          );
          console.log(
            `Camera euler (XYZ deg): x=${(euler.x * 180 / Math.PI).toFixed(2)}, y=${(euler.y * 180 / Math.PI).toFixed(2)}, z=${(euler.z * 180 / Math.PI).toFixed(2)}`,
          );
          if (cameraControls.current) {
            const target = cameraControls.current.getTarget({
              x: 0,
              y: 0,
              z: 0,
            } as Vector3);
            console.log(
              `Camera target: x=${target.x.toFixed(3)}, y=${target.y.toFixed(3)}, z=${target.z.toFixed(3)}`,
            );
          }
          const axes = getPortalWorldAxes(portalRef);
          if (axes) {
            const { worldPos, normal } = axes;
            const portalUp = new Vector3(0, 1, 0).applyQuaternion(axes.worldQuat);
            console.log(
              `Portal world pos: x=${worldPos.x.toFixed(3)}, y=${worldPos.y.toFixed(3)}, z=${worldPos.z.toFixed(3)}`,
            );
            console.log(
              `Portal world normal: x=${normal.x.toFixed(3)}, y=${normal.y.toFixed(3)}, z=${normal.z.toFixed(3)}`,
            );
            console.log(
              `Portal world up: x=${portalUp.x.toFixed(3)}, y=${portalUp.y.toFixed(3)}, z=${portalUp.z.toFixed(3)}`,
            );
          }
        }),
        'Hard Snap to Entry': button(() => {
          const axes = getPortalWorldAxes(portalRef);
          if (!axes || !cameraControls.current) return;
          const { worldPos, worldQuat, normal } = axes;
          const camPos = worldPos
            .clone()
            .addScaledVector(normal, entryDistanceRef.current);
          cameraControls.current.camera.up
            .set(0, 1, 0)
            .applyQuaternion(worldQuat)
            .normalize();
          cameraControls.current.updateCameraUp();
          cameraControls.current.setLookAt(
            camPos.x,
            camPos.y,
            camPos.z,
            worldPos.x,
            worldPos.y,
            worldPos.z,
            false,
          );
        }),
        'Snap to Entry': button(() => {
          const axes = getPortalWorldAxes(portalRef);
          if (!axes || !cameraControls.current) return;
          const { worldPos, worldQuat, normal } = axes;
          const camPos = worldPos
            .clone()
            .addScaledVector(normal, entryDistanceRef.current);
          cameraControls.current.camera.up
            .set(0, 1, 0)
            .applyQuaternion(worldQuat)
            .normalize();
          cameraControls.current.updateCameraUp();
          cameraControls.current.setLookAt(
            camPos.x,
            camPos.y,
            camPos.z,
            worldPos.x,
            worldPos.y,
            worldPos.z,
            true,
          );
        }),
        'Snap to Exit': button(() => {
          const axes = getPortalWorldAxes(portalRef);
          if (!axes || !cameraControls.current) return;
          const { worldPos, worldQuat, normal } = axes;
          const camPos = worldPos
            .clone()
            .addScaledVector(normal, exitDistanceRef.current);
          cameraControls.current.camera.up
            .set(0, 1, 0)
            .applyQuaternion(worldQuat)
            .normalize();
          cameraControls.current.updateCameraUp();
          cameraControls.current.setLookAt(
            camPos.x,
            camPos.y,
            camPos.z,
            worldPos.x,
            worldPos.y,
            worldPos.z,
            true,
          );
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
            '/2': () => cameraControls.current?.zoom((cameraControls.current?.camera.zoom ?? 1) / 2, true),
            '/-2': () => cameraControls.current?.zoom(-(cameraControls.current?.camera.zoom ?? 1) / 2, true),
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
            const axes = getPortalWorldAxes(portalRef);
            if (!axes) return;
            const { worldPos, normal } = axes;
            console.log(
              `Portal world pos: x=${worldPos.x.toFixed(3)}, y=${worldPos.y.toFixed(3)}, z=${worldPos.z.toFixed(3)}`,
            );
            console.log(
              `Portal normal: x=${normal.x.toFixed(3)}, y=${normal.y.toFixed(3)}, z=${normal.z.toFixed(3)}`,
            );
          }),
          showPortalNormal: { value: false, label: 'Show Portal Axis' },
          showPortalHorizontal: { value: false, label: 'Show Horizontal Axis' },
        },
        { collapsed: true },
      ),
    }),
    { collapsed: true },
  );

  isActiveRef.current = isActive;
  entryDistanceRef.current = entryDistance;
  exitDistanceRef.current = exitDistance;

  positionCameraRef.current = (isResize = false) => {
    if (!cameraControls.current || !portalRef.current) {
      return;
    }
    const isDesktop = window.innerWidth >= TABLET_BREAKPOINT;
    const activeShoulderPosition = isDesktop
      ? desktopShoulderPosition
      : shoulderPosition;
    const axes = getPortalWorldAxes(portalRef);
    if (!axes) return;
    const { worldPos, worldQuat, normal } = axes;
    if (!isResize) {
      const camPos = worldPos.clone().addScaledVector(normal, entryDistance);
      cameraControls.current.camera.up
        .set(0, 1, 0)
        .applyQuaternion(worldQuat)
        .normalize();
      cameraControls.current.updateCameraUp();
      cameraControls.current.setLookAt(
        camPos.x,
        camPos.y,
        camPos.z,
        worldPos.x,
        worldPos.y,
        worldPos.z,
        false,
      );
    }
    const offset = isDesktop
      ? {
          x: window.innerWidth * 0.006,
          y: desktopLookAtOffset.y,
          z: desktopLookAtOffset.z,
        }
      : lookAtOffset;
    cameraControls.current.camera.up.set(0, 1, 0);
    cameraControls.current.updateCameraUp();
    cameraControls.current.setLookAt(
      activeShoulderPosition.x,
      activeShoulderPosition.y,
      activeShoulderPosition.z,
      worldPos.x + offset.x,
      worldPos.y + offset.y,
      worldPos.z + offset.z,
      !isResize,
    );
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        set({
          desktopLookAtOffset: { x: window.innerWidth * 0.006, y: -3, z: 0 },
        });
        if (isActiveRef.current) {
          // @ts-expect-error investigate this
          positionCameraRef.current(true);
        }
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [set]);

  useFrame((_, delta) => {
    const becameActive = isActive && !prevIsActiveRef.current;
    prevIsActiveRef.current = isActive;

    if (!isActive) return;

    if (becameActive) {
      positionCameraRef.current();
    }

    const light = rectLightRef.current;
    const state = lerpState.current;
    if (light && state.elapsed < THEME_TRANSITION_DURATION) {
      state.elapsed = Math.min(
        state.elapsed + delta,
        THEME_TRANSITION_DURATION,
      );
      const t = state.elapsed / THEME_TRANSITION_DURATION;
      currentLerpedColor.current.copy(state.fromColor).lerp(state.toColor, t);
      light.color.copy(currentLerpedColor.current);
    }

    if (showCameraHelpers && portalRef.current) {
      const axes = getPortalWorldAxes(portalRef);
      if (axes) {
        const { worldPos, normal } = axes;
        entryMarkerRef.current?.position.copy(
          worldPos.clone().addScaledVector(normal, entryDistanceRef.current),
        );
        exitMarkerRef.current?.position.copy(
          worldPos.clone().addScaledVector(normal, exitDistanceRef.current),
        );
      }
    }
  });

  useEffect(() => {
    const axes = getPortalWorldAxes(portalRef);
    if (!axes || !cameraControls.current) return;
    const { worldPos, worldQuat, normal } = axes;
    const camPos = worldPos.clone().addScaledVector(normal, entryDistance);
    cameraControls.current.camera.up
      .set(0, 1, 0)
      .applyQuaternion(worldQuat)
      .normalize();
    cameraControls.current.updateCameraUp();
    cameraControls.current.setLookAt(
      camPos.x,
      camPos.y,
      camPos.z,
      worldPos.x,
      worldPos.y,
      worldPos.z,
      true,
    );
  }, [entryDistance]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    hasShownPanel.current = false;
    hidePanel();
    const isMobile = window.innerWidth < TABLET_BREAKPOINT;
    const timer = setTimeout(() => showPanel(), isMobile ? 4500 : 2500);

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

    const axes = getPortalWorldAxes(portalRef);
    if (!axes) return;
    const { worldPos, worldQuat, normal } = axes;
    const camPos = worldPos.clone().addScaledVector(normal, exitDistance);

    cameraControls.current.camera.up
      .set(0, 1, 0)
      .applyQuaternion(worldQuat)
      .normalize();
    cameraControls.current.updateCameraUp();
    cameraControls.current.setLookAt(
      camPos.x,
      camPos.y,
      camPos.z,
      worldPos.x,
      worldPos.y,
      worldPos.z,
      true,
    );

    const exitTimer = setTimeout(() => commitScene(), 2000);

    return () => clearTimeout(exitTimer);
  }, [pendingScene, isActive, commitScene, hidePanel, exitDistance]);

  const {
    transmission: meshTransmission,
    roughness: meshRoughness,
    thickness: meshThickness,
    ior: meshIor,
    clearcoat: meshClearcoat,
    attenuationDistance: meshAttenuationDistance,
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
          transmission: { value: 0.85, min: 0, max: 1 },
          roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
          thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
          ior: { value: 3.5, min: 1, max: 5, step: 0.01 },
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
          attenuationDistance: { value: 4, min: 0, max: 10, step: 0.01 },
          color: '#222222',
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

      <mesh ref={entryMarkerRef} visible={showCameraHelpers}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={'green'} />
      </mesh>
      <mesh ref={exitMarkerRef} visible={showCameraHelpers}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={'red'} />
      </mesh>

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

        <WaldowAvatar isActive={isActive} />

        <CodingDesk
          position={[deskPosition.x, deskPosition.y, deskPosition.z]}
          transmission={isLowPerf ? 0 : meshTransmission}
          roughness={meshRoughness}
          thickness={meshThickness}
          ior={meshIor}
          clearcoat={isLowPerf ? 0 : meshClearcoat}
          attenuationDistance={meshAttenuationDistance}
          color={meshColor}
        />

        <CodingChair
          position={[chairPosition.x, chairPosition.y, chairPosition.z]}
          transmission={isLowPerf ? 0 : meshTransmission}
          roughness={meshRoughness}
          thickness={meshThickness}
          ior={meshIor}
          clearcoat={isLowPerf ? 0 : meshClearcoat}
          attenuationDistance={meshAttenuationDistance}
          color={meshColor}
        />

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
