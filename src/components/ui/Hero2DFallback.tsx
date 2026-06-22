import { useEffect, useRef, useState } from 'react';

import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';
import { PARALLAX_X_FACTOR, PARALLAX_Y_FACTOR, useMousePosition } from '@/store/useMousePosition.ts';

export const Hero2DFallback = () => {
  const isLoaded = useCanvasLoaded((s) => s.isLoaded);
  const mousePosition = useMousePosition();
  const [progress, setProgress] = useState(0);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    isLoadedRef.current = isLoaded;
  }, [isLoaded]);

  useEffect(() => {
    const DELAY = 500;
    const NATURAL_DURATION = 2500;
    let startTime: number | null = null;
    let current = 0;
    let rafId: number;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = Math.max(0, now - startTime - DELAY);
      const t = Math.min(elapsed / NATURAL_DURATION, 1);
      // Ease-out cubic: starts fast, decelerates near the 0.9 cap
      const eased = 1 - Math.pow(1 - t, 3);

      // Natural ceiling is 0.9; jumps to 1.0 only when fully loaded
      const target = isLoadedRef.current ? 1 : eased * 0.9;

      // Display always lerps toward target — never set directly
      current += (target - current) * 0.05;
      if (Math.abs(current - target) < 0.0005) current = target;

      setProgress(current);

      // Keep running until display reaches 1.0 AND load is complete
      if (!(isLoadedRef.current && current >= 0.9995)) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // cx: 100 = shadow centered on sun (new moon), -80 = shadow off left (full sun)
  const shadowCx = 100 - 180 * progress;

  // Glow x: tracks the lit right portion moving from right edge toward center
  const glowXPct = 77 - 27 * progress;

  // Screen glow ramps up sharply as progress approaches 1
  const screenGlowIntensity = Math.pow(progress, 1.5);

  const sunOffsetX = mousePosition.x * PARALLAX_X_FACTOR;
  const sunOffsetY = mousePosition.y * PARALLAX_Y_FACTOR;

  return (
    <div
      className={`fixed inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Full-screen orange glow that fills the screen as progress approaches 100% */}
      <div
        className={'absolute inset-0'}
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,90,0,${screenGlowIntensity * 0.75}) 0%, rgba(210,40,0,${screenGlowIntensity * 0.5}) 45%, transparent 75%)`,
        }}
      />

      <div
        className={'relative w-[50vmin] h-[50vmin] md:w-[800px] md:h-[800px]'}
        style={{ transform: `translate(${sunOffsetX}px, ${sunOffsetY}px)` }}
      >
        {/* Orange glow grows from right-side crescent to full disc */}
        <div
          className={'absolute inset-[-60%]'}
          style={{
            background: `radial-gradient(circle at ${glowXPct}% 50%, rgba(255,120,0,${0.85 * progress}) 0%, rgba(230,60,0,${0.55 * progress}) 30%, transparent 65%)`,
          }}
        />

        <svg viewBox={'0 0 200 200'} className={'relative w-full h-full'}>
          <defs>
            <clipPath id={'sun-clip'}>
              <circle cx={'100'} cy={'100'} r={'90'} />
            </clipPath>
          </defs>

          <circle cx={'100'} cy={'100'} r={'90'} fill={'#f5e642'} />

          {/* Dark shadow circle slides left to reveal the sun (moon phase effect) */}
          <circle
            cx={shadowCx}
            cy={'100'}
            r={'90'}
            fill={'#000000'}
            clipPath={'url(#sun-clip)'}
          />
        </svg>
      </div>
    </div>
  );
};
