import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';

import { Hero } from '@/components/scenes/Hero/Hero.tsx';
import { Background } from '@/components/ui/Background.tsx';
import { useTheme } from '@/store/useTheme.ts';

export const HeroPortal = () => {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'THEME_CHANGE') {
        useTheme.setState({ theme: event.data.theme });
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className={'fixed flex w-full h-lvh'}>
      <Background />
      <Canvas
        camera={{
          fov: 75,
          near: 0.01,
          far: 100,
          position: [0, 0, 5],
        }}
        legacy={true}
      >
        <Hero />
      </Canvas>
    </div>
  );
};
