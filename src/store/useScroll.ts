import { createWithEqualityFn } from 'zustand/traditional';

export interface ScrollState {
  scrollPercentage: number;

  // Actions
  updateScrollPercentage: (newScrollPercentage: number) => void;
}
export const useScroll = createWithEqualityFn<ScrollState>((set) => {
  return {
    scrollPercentage: 0,

    // Actions
    updateScrollPercentage: (newScrollPercentage: number) => {
      set(() => {
        return {
          scrollPercentage: newScrollPercentage,
        };
      });
    }
  };
});
