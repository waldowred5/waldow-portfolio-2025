import { type RefObject, useEffect } from 'react';

export const POINTER_OFFSET_MESSAGE = 'POINTER_OFFSET';

// Mirrors this window's pointer offset from centre into the iframe so mouse-driven parallax matches in both
export const useForwardPointerToIframe = (
  iframeRef: RefObject<HTMLIFrameElement | null>,
) => {
  useEffect(() => {
    const forward = (clientX: number, clientY: number, scale: number) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: POINTER_OFFSET_MESSAGE,
          x: (clientX - window.innerWidth / 2) * scale,
          y: (clientY - window.innerHeight / 2) * scale,
        },
        '*',
      );
    };
    const handleMouseMove = (event: MouseEvent) =>
      forward(event.clientX, event.clientY, 1);
    // Matches useMousePosition's doubled touch offset
    const handleTouchMove = (event: TouchEvent) =>
      forward(event.touches[0].clientX, event.touches[0].clientY, 2);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [iframeRef]);
};
