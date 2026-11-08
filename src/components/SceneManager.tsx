import { button, folder, useControls } from 'leva';
import { useEffect, useRef } from 'react';
import { ACESFilmicToneMapping, type Group } from 'three';

import { Coding } from '@/components/scenes/Coding.tsx';
import { Hero } from '@/components/scenes/Hero/Hero.tsx';
import { useAdaptiveQuality } from '@/hooks/useAdaptiveQuality.ts';
import { usePrewarmScene } from '@/hooks/usePrewarmScene.ts';
import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';
import { useCodingSceneReady } from '@/store/useCodingSceneReady.ts';
import { SCENE, useScene } from '@/store/useScene.ts';

export const SceneManager = () => {
  useAdaptiveQuality();

  const { currentScene, updateScene } = useScene((state) => ({
    currentScene: state.currentScene,
    updateScene: state.updateScene,
  }));

  const heroRef = useRef<Group>(null);
  const codingRef = useRef<Group>(null);
  // Coding scene assets start loading only once the hero has finished loading
  const isHeroLoaded = useCanvasLoaded((s) => s.isGlowFading);
  const { assetsReady, setPrewarmed } = useCodingSceneReady((s) => ({
    assetsReady: s.assetsReady,
    setPrewarmed: s.setPrewarmed,
  }));

  usePrewarmScene({
    enabled: assetsReady,
    targetRef: codingRef,
    hiddenRef: heroRef,
    // Hero's EffectComposer disables renderer tone mapping while mounted; the coding scene renders with the canvas default
    toneMapping: ACESFilmicToneMapping,
    onComplete: setPrewarmed,
  });

  const defaultValues = {
    scene: currentScene,
  };

  const [, set] = useControls(
    'Scene Manager',
    () => ({
      Scene: folder(
        {
          'Reset Scene Defaults': button(() => {
            (set as (v: Record<string, unknown>) => void)(defaultValues);
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
    (set as (v: Record<string, unknown>) => void)({ scene: currentScene });
  }, [currentScene, set]);

  const isHero = currentScene === SCENE.HERO;
  const isCoding = currentScene === SCENE.CODING;

  return (
    <>
      <group ref={heroRef} visible={isHero}>
        <Hero isActive={isHero} isRevealed={isHeroLoaded} />
      </group>
      <group ref={codingRef} visible={isCoding}>
        {(isHeroLoaded || isCoding) && <Coding isActive={isCoding} />}
      </group>
    </>
  );
};
