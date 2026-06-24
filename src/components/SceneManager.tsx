import { useEffect } from 'react';
import { button, folder, useControls } from 'leva';

import { Coding } from '@/components/scenes/Coding.tsx';
import { Hero } from '@/components/scenes/Hero/Hero.tsx';
import { SCENE, useScene } from '@/store/useScene.ts';

export const SceneManager = () => {
  const { currentScene, updateScene } = useScene((state) => ({
    currentScene: state.currentScene,
    updateScene: state.updateScene,
  }));

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

  const SceneMap = {
    [SCENE.HERO]: Hero,
    [SCENE.CODING]: Coding,
  };

  const Component = SceneMap[currentScene] || SceneMap[SCENE.HERO];

  return <Component />;
};
