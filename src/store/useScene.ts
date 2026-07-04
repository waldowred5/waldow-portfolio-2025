import { createWithEqualityFn } from 'zustand/traditional';

export const SCENE = {
  HERO: 'HERO',
  CODING: 'CODING',
};

interface SceneState {
  currentScene: string;
  pendingScene: string | null;

  updateScene: (scene: string) => void;
  requestScene: (scene: string) => void;
  commitScene: () => void;
}
export const useScene = createWithEqualityFn<SceneState>((set) => {
  return {
    currentScene: SCENE.HERO,
    pendingScene: null,

    updateScene: (scene) => {
      set(() => ({ currentScene: scene }));
    },
    requestScene: (scene) => {
      set((state) => {
        if (
          state.currentScene === SCENE.CODING &&
          scene !== state.currentScene
        ) {
          return { pendingScene: scene };
        }

        return { currentScene: scene };
      });
    },
    commitScene: () => {
      set((state) => ({
        currentScene: state.pendingScene ?? state.currentScene,
        pendingScene: null,
      }));
    },
  };
});
