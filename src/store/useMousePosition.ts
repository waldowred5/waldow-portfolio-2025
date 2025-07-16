import { useEffect, useState } from 'react';

import { useWindowSize } from '@/store/useWindowSize.ts';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { innerWidth, innerHeight } = useWindowSize();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX - innerWidth / 2, y: event.clientY - innerHeight / 2 });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePosition;
};