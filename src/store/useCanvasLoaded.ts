import { createWithEqualityFn } from 'zustand/traditional';

interface ICanvasLoaded {
  isLoaded: boolean;
  isCanvasReady: boolean;
  isFontsReady: boolean;
  setCanvasReady: () => void;
  setFontsReady: () => void;
}

export const useCanvasLoaded = createWithEqualityFn<ICanvasLoaded>((set) => ({
  isLoaded: false,
  isCanvasReady: false,
  isFontsReady: false,
  setCanvasReady: () =>
    set((state) => ({
      isCanvasReady: true,
      isLoaded: state.isFontsReady,
    })),
  setFontsReady: () =>
    set((state) => ({
      isFontsReady: true,
      isLoaded: state.isCanvasReady,
    })),
}));
