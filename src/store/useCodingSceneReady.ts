import { createWithEqualityFn } from 'zustand/traditional';

interface ICodingSceneReady {
  isReady: boolean;
  setReady: () => void;
}

export const useCodingSceneReady = createWithEqualityFn<ICodingSceneReady>((set) => ({
  isReady: false,
  setReady: () => set({ isReady: true }),
}));
