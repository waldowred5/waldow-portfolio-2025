import { useEffect, useRef, useState } from 'react';

import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';

export const Hero2DFallback = () => {
  const isLoaded = useCanvasLoaded((s) => s.isLoaded);
  const setGlowFading = useCanvasLoaded((s) => s.setGlowFading);
  const [fadeOut, setFadeOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const isLoadedRef = useRef(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isLoadedRef.current = isLoaded;
  }, [isLoaded]);

  useEffect(() => {
    const DURATION = 3000;
    let startTime: number | null = null;
    let current = 0;
    let rafId: number;

    const tick = (now: number) => {
      if (startTime === null) {
        startTime = now;
      }

      const loaded = isLoadedRef.current;
      const t = (now - startTime) / DURATION;

      // Ease-in-quad: slow start, accelerates. Drifts past 3s so it never appears frozen.
      const naturalTarget =
        t < 1 ? Math.pow(t, 2) * 0.9 : Math.min(0.9 + (t - 1) * 0.03, 0.97);

      const target = loaded ? 1 : Math.max(naturalTarget, current);
      const factor = loaded ? 0.15 : 0.04;

      current += (target - current) * factor;
      if (Math.abs(target - current) < 0.0008) {
        current = target;
      }

      // Direct DOM write — no React re-render per frame
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(-50%, -50%) scale(${current})`;
      }

      if (current >= 0.999 && loaded) {
        setGlowFading();
        setFadeOut(true);

        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [setGlowFading]);

  useEffect(() => {
    if (!fadeOut) {
      return;
    }
    const t = setTimeout(() => setUnmounted(true), 900);

    return () => clearTimeout(t);
  }, [fadeOut]);

  if (unmounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none ${fadeOut ? 'opacity-0 transition-opacity duration-[1200ms] ease-out' : 'opacity-100'}`}
    >
      <div
        ref={glowRef}
        className={
          'absolute w-[150vmax] h-[150vmax] top-1/2 left-1/2 rounded-full will-change-transform glow-gradient'
        }
        style={{
          transform: 'translate(-50%, -50%) scale(0)',
        }}
      />
    </div>
  );
};
