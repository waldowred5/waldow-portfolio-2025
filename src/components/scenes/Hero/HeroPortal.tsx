import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';

import { Hero } from '@/components/scenes/Hero/Hero.tsx';
import { Background } from '@/components/ui/Background.tsx';
import { POINTER_OFFSET_MESSAGE } from '@/hooks/useForwardPointerToIframe.ts';
import { useTheme } from '@/store/useTheme.ts';
import { useToonMode } from '@/store/useToonMode.ts';
import { useViewMode } from '@/store/useViewMode.ts';

export const HeroPortal = () => {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'THEME_CHANGE') {
        useTheme.setState({ theme: event.data.theme });
      }
      if (event.data?.type === 'VIEW_MODE_CHANGE') {
        useViewMode.setState({ viewMode: event.data.viewMode });
      }
      if (event.data?.type === 'TOON_CHANGE') {
        useToonMode.setState({ isToon: event.data.isToon });
      }
      // Replays the parent's pointer offset as a local mousemove so the parallax matches the full-size hero
      if (event.data?.type === POINTER_OFFSET_MESSAGE) {
        window.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: window.innerWidth / 2 + event.data.x,
            clientY: window.innerHeight / 2 + event.data.y,
          }),
        );
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className={'fixed flex w-full h-lvh'}>
      <Background />
      <Canvas
        dpr={[1, 2]}
        camera={{
          fov: 75,
          near: 0.01,
          far: 100,
          position: [0, 0, 5],
        }}
        legacy={true}
      >
        <Hero showCta={false} />
      </Canvas>
    </div>
  );
};
