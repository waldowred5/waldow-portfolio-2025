import { Canvas } from '@react-three/fiber';

import { Hero } from '@/components/scenes/Hero/Hero.tsx';
import { Background } from '@/components/ui/Background.tsx';

export const HeroPortal = () => {
  return (
    <div className={'fixed flex w-full h-lvh'}>
      <Background />
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 100,
        }}
        legacy={true}
      >
        <Hero />
      </Canvas>
    </div>
  );
};
