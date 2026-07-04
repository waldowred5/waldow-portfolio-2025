import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { THEME_TRANSITION_DURATION } from '@/lib/constants.ts';
import type { WireframeUniforms } from '@/lib/wireframeShader.ts';
import { useViewMode, VIEW_MODE, type ViewMode } from '@/store/useViewMode.ts';

export const useWireframeProgress = (uniforms: WireframeUniforms) => {
  const prevViewModeRef = useRef<ViewMode>(VIEW_MODE.FULL);
  const transitionStartRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const currentViewMode = useViewMode.getState().viewMode;
    const elapsed = clock.getElapsedTime();

    if (currentViewMode !== prevViewModeRef.current) {
      prevViewModeRef.current = currentViewMode;
      transitionStartRef.current = elapsed;
      uniforms.uWireframeNoiseSeed.value = Math.random() * 100;
    }

    const toWireframe = currentViewMode === VIEW_MODE.WIREFRAME;
    let progress = toWireframe ? 1.0 : 0.0;

    if (transitionStartRef.current !== null) {
      const t = Math.min(
        (elapsed - transitionStartRef.current) / THEME_TRANSITION_DURATION,
        1.0,
      );
      progress = toWireframe ? t : 1.0 - t;
      if (t >= 1.0) {
        transitionStartRef.current = null;
      }
    }

    uniforms.uWireframeProgress.value = progress;
  });
};
