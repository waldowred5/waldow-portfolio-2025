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
      className={'fixed inset-0 pointer-events-none'}
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: fadeOut ? 'opacity 1200ms ease-out' : 'none',
      }}
    >
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          width: '150vmax',
          height: '150vmax',
          top: '50%',
          left: '50%',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          background:
            'radial-gradient(circle, rgba(255,255,50,0.95) 0%, rgba(255,225,0,0.82) 22%, rgba(255,25,0,0.55) 46%, rgba(210,35,0,0.28) 66%, transparent 82%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
