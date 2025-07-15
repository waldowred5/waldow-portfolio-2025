import { createWithEqualityFn } from 'zustand/traditional';

interface WindowSizeState {
  innerHeight: number;
  innerWidth: number;

  // Actions
  updateWindowSize: (height: number, width: number) => void;
}
export const useWindowSize = createWithEqualityFn<WindowSizeState>((set) => {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,

    // Actions
    updateWindowSize: (height, width) => {
      set(() => {
        return {
          innerHeight: height,
          innerWidth: width,
        };
      });
    }
  };
});
