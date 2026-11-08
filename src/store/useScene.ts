import { createWithEqualityFn } from 'zustand/traditional';

import { SCENE_FADE_DURATION_MS } from '@/lib/constants.ts';

export const SCENE = {
  HERO: 'HERO',
  CODING: 'CODING',
};

interface SceneState {
  currentScene: string;
  pendingScene: string | null;
  isFadedOut: boolean;

  updateScene: (scene: string) => void;
  requestScene: (scene: string) => void;
  commitScene: () => void;
}

export const useScene = createWithEqualityFn<SceneState>((set, get) => {
  return {
    currentScene: SCENE.HERO,
    pendingScene: null,
    isFadedOut: false,

    updateScene: (scene) => {
      set(() => ({ currentScene: scene }));
    },
    requestScene: (scene) => {
      const { currentScene } = get();
      if (scene === currentScene) {
        return;
      }
      // The coding scene zooms back into its portal first, then calls commitScene
      if (currentScene === SCENE.CODING) {
        set({ pendingScene: scene });

        return;
      }
      set({ currentScene: scene });
    },
    // Fades to black, swaps to the pending scene while hidden, then fades back in
    commitScene: () => {
      const { pendingScene, isFadedOut } = get();
      if (!pendingScene || isFadedOut) {
        return;
      }
      set({ isFadedOut: true });
      setTimeout(() => {
        set({
          currentScene: pendingScene,
          pendingScene: null,
          isFadedOut: false,
        });
      }, SCENE_FADE_DURATION_MS);
    },
  };
});
