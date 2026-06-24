import { useProgress } from '@react-three/drei';
import { useEffect } from 'react';
import { button, folder, useControls } from 'leva';

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
  const { isReady, setReady } = useCodingSceneReady((s) => ({
    isReady: s.isReady,
    setReady: s.setReady,
  }));
  const { active } = useProgress();

  useEffect(() => {
    if (isLoaded && !active && !isReady) setReady();
  }, [active, isLoaded, isReady, setReady]);

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
