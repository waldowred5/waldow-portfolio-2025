import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';

import { useSettings } from '../store/useSettings.ts';
import { FX } from './helpers/FX.tsx';
import { KeyboardInputManager } from './helpers/KeyboardInputManager.tsx';
import { SceneManager } from './SceneManager.tsx';

export const FiberCanvas = () => {
  const {
    bloomEnabled,
    statsDebugPanelEnabled,
  } = useSettings((state) => {
    return {
      bloomEnabled: state.bloomEnabled,
      statsDebugPanelEnabled: state.statsDebugPanelEnabled,
    };
  });

  return (
    <>
      <div className={'fixed flex w-full h-lvh'}>
        <KeyboardInputManager>
          <Canvas
            camera={{
              fov: 75,
              near: 0.1,
              far: 100,
            }}
            legacy={true}
          >
            { bloomEnabled && <FX/> }
            { statsDebugPanelEnabled && <Perf position={'bottom-right'}/> }
            <SceneManager/>
          </Canvas>
        </KeyboardInputManager>
      </div>
    </>
  );
};
