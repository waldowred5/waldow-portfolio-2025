import { useProgress } from '@react-three/drei';
import { button, folder, useControls } from 'leva';
import { useEffect } from 'react';

import { Coding } from '@/components/scenes/Coding.tsx';
import { Hero } from '@/components/scenes/Hero/Hero.tsx';
import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';
import { useCodingSceneReady } from '@/store/useCodingSceneReady.ts';
import { SCENE, useScene } from '@/store/useScene.ts';

export const SceneManager = () => {
  const { currentScene, updateScene } = useScene((state) => ({
    currentScene: state.currentScene,
    updateScene: state.updateScene,
  }));

  const isLoaded = useCanvasLoaded((s) => s.isLoaded);
  const { assetsReady, setAssetsReady } = useCodingSceneReady((s) => ({
    assetsReady: s.assetsReady,
    setAssetsReady: s.setAssetsReady,
  }));
  const { active } = useProgress();

  useEffect(() => {
    if (isLoaded && !active && !assetsReady) 
setAssetsReady();
  }, [active, isLoaded, assetsReady, setAssetsReady]);

  const defaultValues = {
    scene: currentScene,
  };

  const [, set] = useControls(
    'Scene Manager',
    () => ({
      Scene: folder(
        {
          'Reset Scene Defaults': button(() => {
            set(defaultValues);
            updateScene(defaultValues.scene);
          }),
          scene: {
            value: currentScene,
            options: {
              Hero: SCENE.HERO,
              Coding: SCENE.CODING,
            },
            onChange: (v: string) => updateScene(v),
          },
        },
        { collapsed: false },
      ),
    }),
    { collapsed: true },
  );

  useEffect(() => {
    set({ scene: currentScene });
  }, [currentScene]);

  const isHero = currentScene === SCENE.HERO;
  const isCoding = currentScene === SCENE.CODING;

  return (
    <>
      <group visible={isHero}>
        <Hero isActive={isHero} />
      </group>
      <group visible={isCoding}>
        <Coding isActive={isCoding} />
      </group>
    </>
  );
};
