import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { THEME_TRANSITION_DURATION } from '@/lib/constants.ts';
import { toonUniforms } from '@/lib/toonShader.ts';
import { useToonMode } from '@/store/useToonMode.ts';

// Spreads the cartoon region in or out over the same duration as the wireframe toggle. Call once per canvas.
export const useToonAmount = () => {
  const prevTargetRef = useRef(0);

  useFrame((_, delta) => {
    const target = useToonMode.getState().isToon ? 1 : 0;
    const amount = toonUniforms.uToonAmount;
    if (target !== prevTargetRef.current) {
      prevTargetRef.current = target;
      // A fresh pattern per toggle, kept if a toggle reverses mid-transition
      if (amount.value === 0 || amount.value === 1) {
        toonUniforms.uToonNoiseSeed.value = Math.random() * 100;
      }
    }
    if (amount.value === target) {
      return;
    }
    const step = delta / THEME_TRANSITION_DURATION;
    amount.value =
      target > amount.value
        ? Math.min(amount.value + step, 1)
        : Math.max(amount.value - step, 0);
  });
};
