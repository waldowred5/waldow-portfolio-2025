import { button, folder, useControls } from 'leva';

import { Coding } from '@/components/scenes/Coding.tsx';
import { Hero } from '@/components/scenes/Hero/Hero.tsx';
import { SCENE, useScene } from '@/store/useScene.ts';

export const SceneManager = () => {
  const { currentScene } = useScene((state) => {
    return {
      currentScene: state.currentScene,
    };
  });

  const defaultValues = {
    opacity: 1,
    currentScene,
  };

  const [{ scene }, set] = useControls(
    'Scene Manager',
    () => ({
      Scene: folder(
        {
          'Reset Scene Defaults': button(() => set(defaultValues)),
          opacity: {
            value: defaultValues.opacity,
            step: 0.01,
            min: 0,
            max: 1,
          },
          scene: {
            value: currentScene,
            options: {
              Hero: SCENE.HERO,
              Coding: SCENE.CODING,
            },
          },
        },
        { collapsed: false },
      ),
    }),
    { collapsed: false },
  );

  const Scene = {
    [SCENE.HERO]: Hero,
    [SCENE.CODING]: Coding,
  };

  const Component = Scene[scene] || Scene[SCENE.HERO];

  return <Component />;
};
