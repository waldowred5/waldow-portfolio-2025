import { createWithEqualityFn } from 'zustand/traditional';

interface IPerformanceTier {
  isLowPerf: boolean;
  setIsLowPerf: (value: boolean) => void;
}

const detectMobile = () =>
  typeof navigator !== 'undefined' &&
  (navigator.maxTouchPoints > 1 ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

export const usePerformanceTier = createWithEqualityFn<IPerformanceTier>(
  (set) => ({
    isLowPerf: detectMobile(),
    setIsLowPerf: (isLowPerf) => set({ isLowPerf }),
  }),
);
