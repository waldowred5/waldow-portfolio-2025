import { createWithEqualityFn } from 'zustand/traditional';

export const SCENE = {
  HERO: 'HERO',
  FLOATING_MACBOOK: 'FLOATING_MACBOOK',
};

interface SceneState {
  currentScene: string;

  // Actions
  updateScene: (scene: string) => void;
}
export const useScene = createWithEqualityFn<SceneState>((set) => {
  return {
    currentScene: SCENE.HERO,

    // Actions
    updateScene: (scene) => {
      set(() => ({ currentScene: scene }));
    },
  };
});
