import { useEffect, useState } from 'react';

import { useWindowSize } from '@/store/useWindowSize.ts';

export const PARALLAX_X_FACTOR = -0.05;
export const PARALLAX_Y_FACTOR = 0.02;

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { innerWidth, innerHeight } = useWindowSize();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX - innerWidth / 2,
        y: event.clientY - innerHeight / 2,
      });
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      setMousePosition({
        x: (touch.clientX - innerWidth / 2) * 2,
        y: (touch.clientY - innerHeight / 2) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [innerHeight, innerWidth]);

  return mousePosition;
};
