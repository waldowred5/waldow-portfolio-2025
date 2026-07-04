import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { usePerformanceTier } from '@/store/usePerformanceTier.ts';

const FPS_THRESHOLD = 30;
const WARMUP_SECONDS = 1;
const SAMPLE_DURATION = 3;

export const useAdaptiveQuality = () => {
  const setIsLowPerf = usePerformanceTier((s) => s.setIsLowPerf);
  const frameCountRef = useRef(0);
  const windowStartRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (usePerformanceTier.getState().isLowPerf) {
      return;
    }

    const now = clock.getElapsedTime();

    if (windowStartRef.current === null) {
      if (now >= WARMUP_SECONDS) {
        windowStartRef.current = now;
      }

      return;
    }

    frameCountRef.current++;
    const elapsed = now - windowStartRef.current;

    if (elapsed >= SAMPLE_DURATION) {
      const fps = frameCountRef.current / elapsed;
      if (fps < FPS_THRESHOLD) {
        setIsLowPerf(true);
      } else {
        frameCountRef.current = 0;
        windowStartRef.current = now;
      }
    }
  });
};
