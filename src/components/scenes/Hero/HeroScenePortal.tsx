import { Canvas } from '@react-three/fiber';

import { HeroScene } from '@/components/scenes/Hero/HeroScene.tsx';
import { Background } from '@/components/ui/Background.tsx';

export const HeroScenePortal = () => {
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
        <HeroScene />
      </Canvas>
    </div>
  );
};
