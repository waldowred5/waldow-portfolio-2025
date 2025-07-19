import { Canvas } from '@react-three/fiber';
import { button, folder, useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { KeyboardInputManager } from './helpers/KeyboardInputManager.tsx';
import { SceneManager } from './SceneManager.tsx';

export const FiberCanvas = () => {
  const defaultCameraValues = {
    fov: 75,
  };

  const [{ fov, statsDebugPanelEnabled }, set] = useControls(
    'Settings',
    () => ({
      'Reset Settings': button(() =>
        set({ fov: defaultCameraValues.fov, statsDebugPanelEnabled: false }),
      ),
      statsDebugPanelEnabled: {
        value: false,
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
      <div className={'fixed flex w-full h-lvh'}>
        <KeyboardInputManager>
          <Canvas
            legacy={true}
            className={'touch-none'}
            camera={{
              fov,
              near: 0.1,
              far: 100,
            }}
          >
            {statsDebugPanelEnabled && <Perf position={'bottom-right'} />}
            <SceneManager />
          </Canvas>
        </KeyboardInputManager>
      </div>
    </>
  );
};
