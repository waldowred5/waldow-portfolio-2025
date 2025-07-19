import { Canvas } from '@react-three/fiber';

import { FX } from '@/components/helpers/FX.tsx';
import { HeroScene } from '@/components/scenes/HeroScene.tsx';
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
        <FX />
        <HeroScene />
      </Canvas>
    </div>
  );
};
