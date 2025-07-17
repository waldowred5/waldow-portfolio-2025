import { useControls } from 'leva';

import { useSettings } from '../store/useSettings.ts';
import { HeroScene } from './scenes/HeroScene.tsx';

export const SceneManager = () => {
  const {
    FXEnabled,
    statsDebugPanelEnabled,
    updateFXEnabled,
    updateStatsDebugPanelEnabled,
  } = useSettings((state) => {
    return {
      FXEnabled: state.FXEnabled,
      statsDebugPanelEnabled: state.statsDebugPanelEnabled,
      updateFXEnabled: state.updateFXEnabled,
      updateStatsDebugPanelEnabled: state.updateStatsDebugPanelEnabled,
    };
  });

  useControls('Settings', {
    FXEnabled: {
      value: FXEnabled,
      onChange: (value: boolean) => {
        updateFXEnabled(value);
      }
    },
    statsEnabled: {
      value: statsDebugPanelEnabled,
      onChange: (value: boolean) => {
        updateStatsDebugPanelEnabled(value);
      }
    },
  });

  return (
    <>
      <HeroScene/>
      {/* <CoderScene/> */}
    </>
  );
};
