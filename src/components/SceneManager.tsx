import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';

import { TABLET_BREAKPOINT } from '@/lib/constants.ts';

import { useClamp } from '../hooks/useClamp.ts';
import { useScroll } from '../store/useScroll.ts';
import { useSettings } from '../store/useSettings.ts';
import { useWindowSize } from '../store/useWindowSize.ts';
import { HeroScene } from './scenes/HeroScene.tsx';

export const SceneManager = () => {
  const { camera } = useThree();

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

  useFrame(() => {
    if (innerWidth < TABLET_BREAKPOINT) {
      // TODO: Fix this hooks warning
      // eslint-disable-next-line react-hooks/rules-of-hooks
      camera.position.z = useClamp(5.25 - (scrollPercentage * scrollPercentage), 4.25, 5.25);
    } else {
      // TODO: Fix this hooks warning
      // eslint-disable-next-line react-hooks/rules-of-hooks
      camera.position.z = useClamp(4 - (scrollPercentage * scrollPercentage), 3, 4);
    }
  });

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
