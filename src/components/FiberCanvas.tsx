import { Canvas } from '@react-three/fiber';
import { button, folder, useControls } from 'leva';
import { Perf } from 'r3f-perf';
import { useCallback } from 'react';

import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';
import { usePerformanceTier } from '@/store/usePerformanceTier.ts';

import { KeyboardInputManager } from './helpers/KeyboardInputManager.tsx';
import { SceneManager } from './SceneManager.tsx';

export const FiberCanvas = () => {
  const { setCanvasReady, isGlowFading } = useCanvasLoaded((s) => ({
    setCanvasReady: s.setCanvasReady,
    isGlowFading: s.isGlowFading,
  }));
  const isLowPerf = usePerformanceTier((s) => s.isLowPerf);

  const handleCanvasCreated = useCallback(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setCanvasReady()));
  }, [setCanvasReady]);

  const defaultCameraValues = {
    fov: 75,
  };

  const [{ fov, statsDebugPanelEnabled }, set] = useControls(
    'Settings',
    () => ({
      'Reset Settings': button(() =>
        set({
          fov: defaultCameraValues.fov,
          statsDebugPanelEnabled: import.meta.env.DEV,
        }),
      ),
      statsDebugPanelEnabled: {
        value: import.meta.env.DEV,
      },
      camera: folder(
        {
          'Reset Camera Defaults': button(() => set(defaultCameraValues)),
          fov: {
            value: defaultCameraValues.fov,
            step: 5,
          },
        },
        { collapsed: true },
      ),
    }),
    { collapsed: true },
  );

  return (
    <>
      <div
        className={`fixed flex w-full h-lvh transition-opacity duration-300 ${isGlowFading ? 'opacity-100' : 'opacity-0'}`}
      >
        <KeyboardInputManager>
          <Canvas
            legacy={true}
            className={'touch-none'}
            dpr={isLowPerf ? 1 : [1, 2]}
            camera={{
              fov,
              near: 0.01,
              far: 100,
            }}
            onCreated={handleCanvasCreated}
          >
            {statsDebugPanelEnabled && (
              <Perf position={'top-left'} style={{ zIndex: 9999 }} />
            )}
            <SceneManager />
          </Canvas>
        </KeyboardInputManager>
      </div>
    </>
  );
};
